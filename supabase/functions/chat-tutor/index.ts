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
      { 
        global: { 
          headers: { Authorization: req.headers.get('Authorization')! } 
        } 
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized: Verification failed')

    const { message, history, persona } = await req.json()

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) throw new Error('GEMINI_API_KEY is not configured in Supabase Secrets');

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { maxOutputTokens: 1024 }
    });

    // Persona-based System Prompt
    const personas: Record<string, string> = {
      socratic: "You are a Socratic tutor. Only ask leading questions to guide the student to the answer. Never provide direct solutions. Encourage critical thinking.",
      eli5: "You are a friendly tutor who explains complex academic concepts using simple analogies suitable for a 5-year-old.",
      direct: "You are a high-performance academic assistant. Provide direct, concise, and technically accurate answers.",
    };

    const systemInstruction = personas[persona] || "You are a helpful Professor AI assistant in a specialized academic environment.";

    // Gemini expects 'user' and 'model' roles
    const conversationArgs = (history || [])
      .filter((h: any) => h.text && h.sender)
      .map((h: any) => ({
        role: h.sender === 'assistant' || h.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

    const chat = model.startChat({
       history: conversationArgs,
    });

    const fullPrompt = `${systemInstruction}\n\nStudent asks: ${message}`;
    const result = await chat.sendMessage(fullPrompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(`[chat-tutor] Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
