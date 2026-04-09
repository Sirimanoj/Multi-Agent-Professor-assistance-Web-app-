-- Table to store detailed learning profiles for each student
CREATE TABLE IF NOT EXISTS public.student_learning_profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    preferred_format TEXT DEFAULT 'visual', -- visual, audio, text, interactive
    understanding_level JSONB DEFAULT '{}'::jsonb, -- dynamic mapping of topics to levels
    learning_speed TEXT DEFAULT 'intermediate', -- fast, intermediate, foundational
    weak_concepts TEXT[] DEFAULT '{}',
    strong_concepts TEXT[] DEFAULT '{}',
    quiz_history JSONB DEFAULT '[]'::jsonb,
    summary_history JSONB DEFAULT '[]'::jsonb
);

-- Table to store adaptive quizzes and responses
CREATE TABLE IF NOT EXISTS public.adaptive_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID,
    material_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    questions JSONB NOT NULL,
    difficulty TEXT,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    feedback TEXT,
    responses JSONB
);

-- Table to store lecture summaries and AI analysis
CREATE TABLE IF NOT EXISTS public.lecture_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID,
    material_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content TEXT NOT NULL,
    score_understanding INTEGER,
    score_clarity INTEGER,
    score_depth INTEGER,
    identified_misconceptions TEXT[],
    feedback TEXT
);

-- Basic RLS
ALTER TABLE public.student_learning_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view and update own profile" ON public.student_learning_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Professors can view all profiles" ON public.student_learning_profiles FOR SELECT USING (true); -- simplify for now

ALTER TABLE public.adaptive_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage own quizzes" ON public.adaptive_quizzes FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.lecture_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage own summaries" ON public.lecture_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Professors can view all summaries" ON public.lecture_summaries FOR SELECT USING (true);
