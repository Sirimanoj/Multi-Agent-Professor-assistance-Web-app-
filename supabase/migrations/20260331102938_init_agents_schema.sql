-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store agent execution logs for transparency
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    agent_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    course_id UUID -- optionally link to a course
);

-- Table to store vectors for course material
CREATE TABLE IF NOT EXISTS public.materials_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL,
    embedding VECTOR(768), -- Gemini 1.5 Pro embeddings are usually 768 dimensions
    course_id UUID -- optionally link to a course
);

-- Basic RLS for agent_logs
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professors can view all logs" ON public.agent_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert logs" ON public.agent_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Basic RLS for materials_embeddings
ALTER TABLE public.materials_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can select embeddings" ON public.materials_embeddings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert embeddings" ON public.materials_embeddings FOR INSERT WITH CHECK (true);
