export type Course = {
  id: string;
  code: string;
  name: string;
  instructor_id: string;
  term: string;
  created_at: string;
};

export type CourseEnrollment = {
  course_id: string;
  student_id: string;
  created_at: string;
};

export type Material = {
  id: string;
  course_id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url?: string;
  date_added: string;
  created_at: string;
};

export type Assignment = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded' | 'missing';
  urgency: 'high' | 'medium' | 'low';
  topic?: string;
  type: 'must-do' | 'may-do';
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'system' | 'assignment' | 'message';
  created_at: string;
};

export type Announcement = {
  id: string;
  course_id: string;
  author_name: string;
  content: string;
  timestamp: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  name: string;
  role: 'student' | 'professor';
  avatar: string;
  created_at: string;
};

export type LearningProfile = {
  user_id: string;
  preferred_format: 'visual' | 'audio' | 'text' | 'interactive';
  understanding_level: Record<string, number>;
  learning_speed: 'fast' | 'intermediate' | 'foundational';
  weak_concepts: string[];
  strong_concepts: string[];
  current_streak: number;
  badges: string[];
  quiz_history: any[];
  summary_history: any[];
  created_at: string;
  updated_at: string;
};

export type LectureSummary = {
  id: string;
  user_id: string;
  course_id: string;
  material_id?: string;
  content: string;
  score_understanding: number;
  score_clarity: number;
  score_depth: number;
  identified_misconceptions: string[];
  feedback: string;
  created_at: string;
};

export type AdaptiveQuizResult = {
  id: string;
  user_id: string;
  course_id: string;
  material_id?: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  completed: boolean;
  feedback: string;
  questions: any;
  responses?: any;
  created_at: string;
};
