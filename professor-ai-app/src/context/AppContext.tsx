import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Course, Material, Assignment, ChatMessage, Notification, Announcement, UserProfile } from '../data/mockData';
import { initialCourses, initialAssignments, initialChatMessages, initialMaterials, initialNotifications, initialAnnouncements, mockUsers } from '../data/mockData';

interface AppContextType {
  courses: Course[];
  materials: Material[];
  assignments: Assignment[];
  messages: ChatMessage[];
  notifications: Notification[];
  announcements: Announcement[];
  usersList: UserProfile[];
  isGeneratingAssignment: boolean;
  isGrading: boolean;
  isAITyping: boolean;
  theme: 'light' | 'dark';
  activeModal: 'none' | 'course' | 'generate' | 'help';
  
  // Actions
  joinCourse: (code: string) => void;
  createCourse: (name: string) => void;
  uploadMaterial: (file: File) => void;
  generateAssignment: (topic: string) => void;
  submitAssignment: (assignmentId: string) => void;
  sendMessage: (text: string) => void;
  markNotificationRead: (id: string) => void;
  toggleTheme: () => void;
  openModal: (modal: 'none' | 'course' | 'generate' | 'help') => void;
  postAnnouncement: (courseId: string, content: string, authorName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const A_RESPONSES = [
  "I've updated the syllabus based on your new parameters.",
  "Here is a breakdown of the statistical outliers from chapter 4.",
  "I've scheduled an automatic review cycle for next Tuesday.",
  "Your feedback has been incorporated into the master rubric.",
  "Analysis complete. Setting up the next module structure automatically."
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const usersList = mockUsers;
  
  // Simulated Agent States
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [activeModal, setActiveModal] = useState<'none' | 'course' | 'generate' | 'help'>('none');

  // Settings features
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const openModal = (modal: 'none' | 'course' | 'generate' | 'help') => setActiveModal(modal);

  // Professor Features
  const createCourse = (name: string) => {
    const newCourse: Course = {
      id: `c${Date.now()}`,
      code: `NEW${Math.floor(Math.random() * 999)}`,
      name,
      instructor: 'Dr. User',
      term: 'Fall Semester 2024'
    };
    setCourses([newCourse, ...courses]);
  };

  const uploadMaterial = (file: File) => {
    const newMat: Material = {
      id: `m${Date.now()}`,
      courseId: courses[0]?.id || 'c1',
      title: file.name,
      type: 'pdf',
      dateAdded: 'Just now'
    };
    setMaterials([newMat, ...materials]);
  };

  const generateAssignment = (topic: string) => {
    setIsGeneratingAssignment(true);
    // Simulate Knowledge Agent Delay
    setTimeout(() => {
      const newAssign: Assignment = {
        id: `a${Date.now()}`,
        courseId: courses[0]?.id || 'c1',
        title: `AI Generated: ${topic}`,
        description: `Automatically compiled assignment rubric covering key aspects of ${topic}. Ready for distribution.`,
        dueDate: 'Next Week',
        status: 'pending',
        urgency: 'medium'
      };
      setAssignments([newAssign, ...assignments]);
      setIsGeneratingAssignment(false);
    }, 2500);
  };

  // Student Features
  const joinCourse = (code: string) => {
    if (code.length > 3) {
      createCourse("Joined Class: " + code); // Mock behavior linking to a new class
    }
  };

  const submitAssignment = (assignmentId: string) => {
    setIsGrading(true);
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'submitted', urgency: 'medium' } : a));
    setIsGrading(true);
    // Simulate Grading Agent Delay
    setTimeout(() => {
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'graded' } : a));
      setIsGrading(false);
    }, 3000);
  };

  // Chat Features
  const sendMessage = (text: string) => {
    const newUserMsg: ChatMessage = { id: `m${Date.now()}`, text, sender: 'user', timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newUserMsg]);
    setIsAITyping(true);
    
    // Simulate RAG Assistant Delay
    setTimeout(() => {
      const aiResponse = A_RESPONSES[Math.floor(Math.random() * A_RESPONSES.length)];
      setMessages(prev => [...prev, { id: `m${Date.now() + 1}`, text: aiResponse, sender: 'assistant', timestamp: new Date().toISOString() }]);
      setIsAITyping(false);
    }, 2000);
  };

  const postAnnouncement = (courseId: string, content: string, authorName: string) => {
    setAnnouncements(prev => [{ id: 'an'+Date.now(), courseId, authorName, content, timestamp: 'Just now' }, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      courses, materials, assignments, messages, notifications, announcements, usersList,
      isGeneratingAssignment, isGrading, isAITyping, theme, activeModal,
      joinCourse, createCourse, uploadMaterial, generateAssignment, submitAssignment, sendMessage, markNotificationRead, toggleTheme, openModal, postAnnouncement
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
