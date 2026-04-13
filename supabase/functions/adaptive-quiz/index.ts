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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error("[adaptive-quiz] Missing Authorization header");
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: corsHeaders })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error("[adaptive-quiz] Auth Error:", authError?.message || "User not found");
      return new Response(JSON.stringify({ error: 'Unauthorized: ' + (authError?.message || 'Invalid session') }), { status: 401, headers: corsHeaders })
    }

    const { materialId, courseId, topic } = await req.json()

    // 1. Fetch Material Metadata & Content
    const { data: material } = await supabaseClient
      .from('materials')
      .select('title, type, url, content')
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

    if (!material?.content || material.content.length < 100 || material.content.includes("pending")) {
      return new Response(JSON.stringify({ 
        error: "NO_MATERIAL_CONTENT", 
        message: "The Professor Assistant is still analyzing this material. Please wait a moment for the 'Processing' status to clear." 
      }), { status: 400, headers: corsHeaders });
    }

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) throw new Error('GEMINI_API_KEY not found');

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a STRICT ROLE-PLAYING Quiz Generator AI. 
      You MUST generate questions ONLY from the provided content below. 
      Do NOT use any external knowledge or general facts not explicitly stated.

      GROUNDING RULES:
      1. Every question must be directly traceable to a specific sentence in the content.
      2. If information is not present, do NOT create a question about it.
      3. Use EXACT facts, terms, or concepts from the content.
      4. Target Academic Level: ${difficulty}

      QUIZ PARAMETERS:
      - Topic: "${topic}"
      - Material Title: "${material.title}"
      - Question Count: 10
      - Format: 4 options, exactly one correct answer.

      PROVIDED CONTENT:
      """
      ${material.content}
      """
      
      OUTPUT REQUIREMENTS:
      Return ONLY a JSON array with this exact structure (no markdown backticks):
      [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswerIndex": number (0-3),
          "explanation": "string",
          "source_reference": "EXACT sentence or phrase from the content above that validates this question"
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
