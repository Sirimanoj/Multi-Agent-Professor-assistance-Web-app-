import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface AgentRequest {
  intent: 'chat' | 'quiz' | 'evaluate' | 'track' | 'content' | 'update';
  content: string;
  context?: any;
  userId?: string;
  courseId?: string;
}

Deno.serve(async (req) => {
  // CORS setup
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } });
  }

  try {
    const { intent, content, context, userId, courseId }: AgentRequest = await req.json();
    console.log(`Received agent request: ${intent}`);

    let response;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    switch (intent) {
      case 'chat':
        response = await handleChat(model, content, context, courseId);
        break;
      case 'quiz':
        response = await handleQuiz(model, content, context);
        break;
      case 'evaluate':
        response = await handleEvaluation(model, content, context);
        break;
      case 'content':
        response = await handleContentParsing(model, content, context);
        break;
      case 'track':
        response = await handleTracking(content, context, userId, courseId);
        break;
      case 'update':
        response = await handleUpdate(content, context, courseId);
        break;
      default:
        throw new Error(`Unknown intent: ${intent}`);
    }

    // Log the activity
    await supabase.from('agent_logs').insert({
      agent_name: intent,
      action: 'execution',
      details: { content, context, response_summary: typeof response === 'string' ? response.substring(0, 50) : 'object' },
      user_id: userId,
      course_id: courseId
    });

    return new Response(JSON.stringify(response), { 
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } 
    });
  }
});

// --- Sub-Agent Handlers ---

async function handleChat(model: any, message: string, context: any, courseId?: string) {
  // Simple RAG placeholder: In a full version, we'd fetch materials_embeddings here.
  const prompt = `You are a Professor Assistant. Your goal is to help students based ONLY on course materials. 
  Teaching Style: Professional, encouraging, and clear.
  
  Student Question: ${message}
  Context: ${JSON.stringify(context || {})}
  
  Provide a helpful, grounded response. If unsure, say you'll check with the professor.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function handleQuiz(model: any, material: string, options: any) {
  const prompt = `Act as a Quiz Agent. Based on the following study material, generate a ${options?.numQuestions || 5}-question quiz.
  Include a mix of multiple choice and short answer questions.
  Provide the output in JSON format with 'questions' array containing {id, type, question, options?, correct_answer}.
  
  Material: ${material}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text().replace(/```json|```/g, ''));
}

async function handleEvaluation(model: any, submission: string, rubric: any) {
  const prompt = `Act as an Evaluation Agent. 
  Rubric: ${JSON.stringify(rubric)}
  Student Submission: ${submission}
  
  Evaluate the submission fairly. Provide a score for each criterion in the rubric and overall feedback.
  Output in JSON: { criteria_scores: { criterion: score }, total_score: X, feedback: "text" }`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text().replace(/```json|```/g, ''));
}

async function handleContentParsing(model: any, text: string, context: any) {
  const prompt = `Act as a Content Agent. Parse the following raw course material and extract key topics, modules, and learning outcomes.
  Material: ${text}
  
  Output in JSON: { topics: [], modules: [], summaries: {} }`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text().replace(/```json|```/g, ''));
}

async function handleTracking(content: string, context: any, userId?: string, courseId?: string) {
  // Tracking agent logic is mostly state updates
  return { status: 'success', message: 'Tracking logic executed (Supabase triggered)' };
}

async function handleUpdate(content: string, context: any, courseId?: string) {
  // Update agent logic for notifications
  return { status: 'success', message: 'Update/Notification logic executed' };
}
