import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Course, Material, Assignment, ChatMessage, Notification, Announcement, UserProfile, LearningProfile, LectureSummary, AdaptiveQuizResult } from '../types/database';

interface AppContextType {
  courses: Course[];
  materials: Material[];
  assignments: Assignment[];
  messages: ChatMessage[];
  notifications: Notification[];
  announcements: Announcement[];
  usersList: UserProfile[];
  profiles: LearningProfile[];
  summaries: LectureSummary[];
  quizzes: AdaptiveQuizResult[];
  isGeneratingAssignment: boolean;
  isLoading: boolean;
  isGrading: boolean;
  isAITyping: boolean;
  isGeneratingQuiz: boolean;
  theme: 'light' | 'dark';
  activeModal: 'none' | 'course' | 'generate' | 'help' | 'quiz' | 'summary' | 'infinite_practice' | 'formats' | 'intervention';
  activeStudentId: string | null;
  activeQuizId: string | null;
  activeCourseId: string | null;

  // Actions
  joinCourse: (code: string) => Promise<void>;
  createCourse: (name: string) => Promise<void>;
  uploadMaterial: (file: File, courseId: string) => Promise<void>;
  generateAssignment: (topic: string, courseId: string) => Promise<void>;
  generateAdaptiveQuiz: (materialId: string, topic: string, courseId: string) => Promise<void>;
  submitQuizAnswers: (quizId: string, answers: Record<string, string>) => Promise<void>;
  markMaterialStudied: (materialId: string) => void;
  studiedMaterials: Set<string>;
  addLinkMaterial: (url: string, courseId: string) => Promise<void>;
  submitLectureSummary: (courseId: string, content: string) => Promise<void>;
  submitAssignment: (assignmentId: string, file?: File) => Promise<void>;
  sendMessage: (text: string, persona: string, currentMessages: any[]) => Promise<any>;
  markNotificationRead: (id: string) => Promise<void>;
  toggleTheme: () => void;
  openModal: (modal: 'none' | 'course' | 'generate' | 'help' | 'quiz' | 'summary' | 'infinite_practice' | 'formats' | 'intervention', id?: string, courseId?: string) => void;
  openInterventionModal: (studentId: string) => void;
  setCourseContext: (courseId: string | null) => void;
  postAnnouncement: (courseId: string, content: string, authorName: string) => Promise<void>;
  fetchData: () => Promise<void>;
  markClassAttended: (courseId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [profiles, setProfiles] = useState<LearningProfile[]>([]);
  const [summaries, setSummaries] = useState<LectureSummary[]>([]);
  const [quizzes, setQuizzes] = useState<AdaptiveQuizResult[]>([]);

  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [studiedMaterials, setStudiedMaterials] = useState<Set<string>>(new Set());
  const [isAITyping, setIsAITyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [activeModal, setActiveModal] = useState<'none' | 'course' | 'generate' | 'help' | 'quiz' | 'summary' | 'infinite_practice' | 'formats' | 'intervention'>('none');
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const openModal = (modal: 'none' | 'course' | 'generate' | 'help' | 'quiz' | 'summary' | 'infinite_practice' | 'formats' | 'intervention', id?: string, courseId?: string) => {
    setActiveModal(modal);
    if (modal === 'quiz' && id) setActiveQuizId(id);
    if (modal === 'intervention' && id) setActiveStudentId(id);
    if (courseId) setActiveCourseId(courseId);
    else if (modal === 'none') setActiveCourseId(null);
  };

  const setCourseContext = (courseId: string | null) => {
    setActiveCourseId(courseId);
  };

  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (user.role === 'professor') {
      const { data: c } = await supabase.from('courses').select('*').eq('instructor_id', user.id);
      setCourses(c || []);

      const { data: p } = await supabase.from('student_learning_profiles').select('*');
      setProfiles(p || []);

      const { data: u } = await supabase.from('user_profiles').select('*').eq('role', 'student');
      setUsersList(u || []);

      const { data: s } = await supabase.from('lecture_summaries').select('*');
      setSummaries(s || []);
      
      const { data: q } = await supabase.from('adaptive_quizzes').select('*');
      setQuizzes(q || []);
      
      const { data: a } = await supabase.from('assignments').select('*');
      setAssignments(a || []);
    } else {
      // Student
      const { data: enrollments } = await supabase.from('course_enrollments').select('course_id').eq('student_id', user.id);
      if (enrollments?.length) {
        const courseIds = enrollments.map((e: any) => e.course_id);
        const { data: c } = await supabase.from('courses').select('*').in('id', courseIds);
        setCourses(c || []);

        const { data: a } = await supabase.from('assignments').select('*').in('course_id', courseIds);
        setAssignments(a || []);
      } else {
        setCourses([]);
        setAssignments([]);
      }

      const { data: p } = await supabase.from('student_learning_profiles').select('*').eq('user_id', user.id);
      setProfiles(p || []);
      
      const { data: q } = await supabase.from('adaptive_quizzes').select('*').eq('user_id', user.id);
      setQuizzes(q || []);

      const { data: s } = await supabase.from('lecture_summaries').select('*').eq('user_id', user.id);
      setSummaries(s || []);
    }
    
    // Global Fetches
    const { data: m } = await supabase.from('materials').select('*');
    setMaterials(m || []);

    const { data: n } = await supabase.from('notifications').select('*').eq('user_id', user.id);
    setNotifications(n || []);

    const { data: an } = await supabase.from('announcements').select('*');
    setAnnouncements(an || []);

    setIsLoading(false);
  };

  useEffect(() => { fetchData() }, [user]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const openInterventionModal = (studentId: string) => {
    setActiveStudentId(studentId);
    setActiveModal('intervention');
  };

  const createCourse = async (name: string) => {
    if (user?.role !== 'professor') return;
    const { data } = await supabase.from('courses').insert({
      name, instructor_id: user.id, code: `NEW${Math.floor(Math.random() * 999)}`, term: 'Current Term'
    }).select().single();
    if (data) setCourses([data, ...courses]);
    setActiveModal('none');
  };

  const uploadMaterial = async (file: File, courseId: string) => {
    if (user?.role !== 'professor') return;
    
    // 1. Upload to Storage
    const fileName = `${courseId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { error: storageError } = await supabase.storage
      .from('materials')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (storageError) {
      console.error("Storage upload error:", storageError);
      alert(`Upload failed: ${storageError.message}`);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(fileName);

    // 2. Insert into DB
    const { data, error } = await supabase.from('materials').insert({
      title: file.name, 
      type: 'pdf', 
      url: publicUrl,
      course_id: courseId, 
      date_added: new Date().toISOString()
    }).select().single();
    
    if (error) {
      console.error("DB insertion error:", error);
      alert("Metadata failed to save.");
      return;
    }

    if (data) setMaterials([data, ...materials]);
  };

  const addLinkMaterial = async (url: string, courseId: string) => {
    if (user?.role !== 'professor') return;
    const { data } = await supabase.from('materials').insert({
      title: url.split('/').pop()?.split('?')[0] || 'Web Resource', 
      type: 'link', 
      url: url,
      course_id: courseId, 
      date_added: new Date().toISOString()
    }).select().single();
    if (data) setMaterials([data, ...materials]);
  };

  const markMaterialStudied = (materialId: string) => {
    setStudiedMaterials(prev => new Set([...Array.from(prev), materialId]));
  };

  const generateAssignment = async (topic: string, courseId: string) => {
    setIsGeneratingAssignment(true);
    const { data } = await supabase.from('assignments').insert({
       title: `AI Generated: ${topic}`,
       description: `Automatically compiled assignment rubric covering key aspects of ${topic}. Ready for distribution.`,
       course_id: courseId, status: 'pending', topic, type: 'must-do', urgency: 'medium'
    }).select().single();
    if (data) setAssignments([data, ...assignments]);
    setIsGeneratingAssignment(false);
    setActiveModal('none');
  };

  const joinCourse = async (code: string) => {
    const { data: c } = await supabase.from('courses').select('id').eq('code', code).single();
    if (c && user) {
      await supabase.from('course_enrollments').insert({ student_id: user.id, course_id: c.id });
      fetchData(); // refresh everything
      setActiveModal('none');
    } else {
      alert("Invalid code or unauthorized.");
    }
  };

  const generateAdaptiveQuiz = async (materialId: string, topic: string, courseId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('adaptive-quiz', {
        body: { materialId, courseId, topic }
      });
      
      if (error) {
        if (error.message?.includes('GEMINI_API_KEY')) {
          alert("AI Error: GEMINI_API_KEY is not configured in your Supabase project. Please set it using 'supabase secrets set GEMINI_API_KEY=...'");
        } else {
          alert(`Quiz Generation failed: ${error.message}`);
        }
        throw error;
      }

      if (data) setQuizzes([data, ...quizzes]);
    } catch (err: any) {
      console.error("Quiz generation failed:", err);
    } finally {
      setIsGeneratingQuiz(false);
      setActiveModal('none');
    }
  };

  const submitQuizAnswers = async (quizId: string, answers: Record<string, string>) => {
    setIsGrading(true);
    // Simulate AI evaluation
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    let correctCount = 0;
    const questions = quiz.questions as any[];
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correctCount++;
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const feedback = score > 70 ? "Excellent understanding! You've mastered these concepts." : "Good effort. Let's review the weak points together.";

    const { data } = await supabase.from('adaptive_quizzes')
      .update({ responses: answers, score, completed: true, feedback })
      .eq('id', quizId)
      .select()
      .single();

    if (data) {
      setQuizzes(prev => prev.map(q => q.id === quizId ? data : q));
    }
    setIsGrading(false);
  };

  const submitLectureSummary = async (courseId: string, content: string) => {
    setIsGrading(true);
    const { data } = await supabase.functions.invoke('evaluate-summary', {
      body: { courseId, content }
    });
    if (data) {
       setSummaries([data, ...summaries]);
       fetchData(); // refresh profile understanding metrics
    }
    setIsGrading(false);
    setActiveModal('none');
  };

  const submitAssignment = async (assignmentId: string, file?: File) => {
    setIsGrading(true);
    
    // In a real app, we would upload the assignment file to storage here
    if (file) {
      const fileName = `submissions/${assignmentId}/${user?.id}-${file.name}`;
      await supabase.storage.from('materials').upload(fileName, file);
    }

    await supabase.from('assignments').update({ status: 'submitted' }).eq('id', assignmentId);
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'submitted' } : a));
    
    // Simulate grading delay
    setTimeout(async () => {
      await supabase.from('assignments').update({ status: 'graded' }).eq('id', assignmentId);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'graded' } : a));
      setIsGrading(false);
    }, 2000);
  };

  const sendMessage = async (text: string, persona: string, currentMessages: any[]) => {
    const isGlobal = currentMessages === messages;
    const newUserMsg: ChatMessage = { id: `m${Date.now()}`, user_id: user!.id, text, sender: 'user', timestamp: new Date().toISOString(), created_at: new Date().toISOString() };
    
    if (isGlobal) setMessages(prev => [...prev, newUserMsg]);
    
    setIsAITyping(true);
    
    try {
      // Use SDK standard invocation which automatically handles session JWT
      const { data, error } = await supabase.functions.invoke('chat-tutor', {
        body: { message: text, history: currentMessages, persona, courseId: activeCourseId }
      });
      
      if (error) throw error;
      
      setIsAITyping(false);
      
      if (data) {
        const aiMsg: ChatMessage = { id: `m${Date.now()+1}`, user_id: user!.id, text: data.text, sender: 'assistant', timestamp: new Date().toISOString(), created_at: new Date().toISOString() };
        if (isGlobal) setMessages(prev => [...prev, aiMsg]);
        return { role: 'ai', text: data.text };
      }
    } catch (err: any) {
      console.error("Chat Tutor failed:", err);
      setIsAITyping(false);
      let errMsg = "I apologize, but my neural link is temporarily down. Please try again in a moment.";
      
      if (err.message?.includes('GEMINI_API_KEY') || (err.status === 400)) {
        errMsg = "Configuration Error: The GEMINI_API_KEY is missing or invalid in your Supabase Secrets. Please add it to your project.";
      }

      if (isGlobal) setMessages(prev => [...prev, { id: `err-${Date.now()}`, user_id: user!.id, text: errMsg, sender: 'assistant', timestamp: new Date().toISOString(), created_at: new Date().toISOString() }]);
      return { role: 'ai', text: errMsg };
    }
    return { role: 'ai', text: 'Connection lost.' };
  };

  const postAnnouncement = async (courseId: string, content: string, authorName: string) => {
    const { data } = await supabase.from('announcements').insert({ course_id: courseId, content, author_name: authorName, timestamp: new Date().toISOString()}).select().single();
    if (data) setAnnouncements([data, ...announcements]);
  };

  const markClassAttended = async (courseId: string) => {
    if (!user || user.role !== 'professor') return;
    
    // 1. Post Announcement
    await postAnnouncement(courseId, 'Todays class has ended! Please submit your lecture summary for Gemini analysis.', user.name);
    
    // 2. Notify Enrolled Students
    const { data: enrollments } = await supabase.from('course_enrollments').select('student_id').eq('course_id', courseId);
    if (enrollments) {
      const notifications = enrollments.map((e: any) => ({
        user_id: e.student_id,
        title: 'Class Ended',
        message: 'Please submit your lecture summary for grading.',
        type: 'info',
        read: false
      }));
      await supabase.from('notifications').insert(notifications);
    }
    alert('Class marked as attended. Students have been notified!');
  };

  return (
    <AppContext.Provider value={{
      courses, materials, assignments, messages, notifications, announcements, usersList, profiles, summaries, quizzes,
      isGeneratingAssignment, isLoading, isGrading, isAITyping, isGeneratingQuiz, theme, activeModal, activeStudentId, activeQuizId, activeCourseId,
      joinCourse, createCourse, uploadMaterial, addLinkMaterial, markMaterialStudied, studiedMaterials, generateAssignment, generateAdaptiveQuiz, submitQuizAnswers, submitLectureSummary, submitAssignment, sendMessage, markNotificationRead, toggleTheme, openModal, openInterventionModal, setCourseContext, postAnnouncement, fetchData, markClassAttended
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
