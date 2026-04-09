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

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { courseId, content } = await req.json()

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert tutor evaluating a text summary written by a student.
      Summary: "${content}"
      
      Score this on 3 aspects out of 100: understanding, clarity, and depth.
      List any misconceptions detected.
      Provide a brief, encouraging feedback message.
      
      Return ONLY a JSON object with this exact structure:
      {
        "scores": { "understanding": number, "clarity": number, "depth": number },
        "misconceptions": ["string"],
        "feedback": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(responseText);

    // Insert into lecture_summaries
    const { data: summaryRecord, error: insertError } = await supabaseClient
      .from('lecture_summaries')
      .insert({
        user_id: user.id,
        course_id: courseId,
        content: content,
        score_understanding: evaluation.scores.understanding,
        score_clarity: evaluation.scores.clarity,
        score_depth: evaluation.scores.depth,
        identified_misconceptions: evaluation.misconceptions,
        feedback: evaluation.feedback
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Update student learning profile
    const { data: profile } = await supabaseClient
      .from('student_learning_profiles')
      .select('understanding_level, summary_history')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      const newUnderstanding = { ...profile.understanding_level, 'Recent Topic': evaluation.scores.understanding };
      const newHistory = [...(profile.summary_history || []), summaryRecord.id];
      await supabaseClient
        .from('student_learning_profiles')
        .update({
          understanding_level: newUnderstanding,
          summary_history: newHistory
        })
        .eq('user_id', user.id)
    }

    return new Response(JSON.stringify(summaryRecord), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
