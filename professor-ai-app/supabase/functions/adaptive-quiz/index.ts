import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { materialId, courseId, topic } = await req.json()

    // 1. Fetch Material Metadata
    const { data: material } = await supabaseClient
      .from('materials')
      .select('title, type, url')
      .eq('id', materialId)
      .single();

    // 2. Get student learning profile for adaptive difficulty
    const { data: profile } = await supabaseClient
      .from('student_learning_profiles')
      .select('understanding_level')
      .eq('user_id', user.id)
      .single();
      
    const userTopicUnderstanding = profile?.understanding_level?.[topic] || 50;
    const difficulty = userTopicUnderstanding > 75 ? 'Advanced (PhD level)' : (userTopicUnderstanding > 40 ? 'Intermediate (Undergraduate)' : 'Fundamental (Foundational)');

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) throw new Error('GEMINI_API_KEY not found');

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Professor AI specializing in creating rigorous adaptive assessments.
      Topic: "${topic}"
      Material Context: ${material ? `Based on source "${material.title}" (${material.type})` : 'General knowledge'}
      Target Academic Level: ${difficulty}
      
      Generate a 3-question multiple choice quiz. 
      Each question must test deep conceptual understanding, not just rote memorization.
      
      Return ONLY a JSON array with this exact structure (no markdown backticks):
      [
        {
          "question": "string",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Detailed pedagogical explanation of why this choice is correct."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(responseText);

    const { data: quizResult, error: insertError } = await supabaseClient
      .from('adaptive_quizzes')
      .insert({
        user_id: user.id,
        course_id: courseId,
        material_id: materialId,
        topic: topic,
        difficulty: difficulty.split(' ')[0], // foundational/intermediate/advanced
        questions: questions,
        total: questions.length,
        score: null,
        completed: false
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify(quizResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(`[adaptive-quiz] Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
