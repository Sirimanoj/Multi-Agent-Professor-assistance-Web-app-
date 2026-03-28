export type Course = {
  id: string;
  code: string;
  name: string;
  instructor: string;
  term: string;
};

export type Material = {
  id: string;
  courseId: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  dateAdded: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'missing';
  urgency: 'high' | 'medium' | 'low';
  topic?: string;
};
export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'system' | 'assignment' | 'message';
};

export type Announcement = {
  id: string;
  courseId: string;
  authorName: string;
  content: string;
  timestamp: string;
};

export type UserProfile = {
  id: string;
  name: string;
  role: 'student' | 'professor';
  avatar: string;
};

export const initialCourses: Course[] = [
  { id: 'c1', code: 'ECO101', name: 'Macroeconomics', instructor: 'Dr. Alistair Thorne', term: 'Spring Semester 2024' },
  { id: 'c2', code: 'MTH202', name: 'Linear Algebra Lab', instructor: 'Prof. Williams', term: 'Spring Semester 2024' },
  { id: 'c3', code: 'PHI301', name: 'Ethics in AI Thesis', instructor: 'Dr. Sterling', term: 'Spring Semester 2024' },
];

export const initialMaterials: Material[] = [
  { id: 'm1', courseId: 'c1', title: 'Syllabus - Macroeconomics.pdf', type: 'pdf', dateAdded: '2 days ago' },
];

export const initialAssignments: Assignment[] = [
  { id: 'a1', courseId: 'c1', title: 'Market Analysis Repo', description: 'Analyze Q3 supply/demand volatility.', dueDate: 'Oct 14', status: 'pending', urgency: 'high', topic: 'Week 1: Fundamentals' },
  { id: 'a2', courseId: 'c2', title: 'Calculus Graphing', description: 'Solve matrix sets 4A to 4F.', dueDate: 'Oct 16', status: 'graded', urgency: 'medium', topic: 'Midterms' },
];

export const initialChatMessages: ChatMessage[] = [
  { id: 'msg1', text: "I've analyzed your current progress. You are performing exceptionally well in Applied Sciences. Would you like me to draft a study schedule for your upcoming Finals?", sender: 'assistant', timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: 'msg2', text: "Yes, please. Prioritize the Quantitative Analysis exam on Friday.", sender: 'user', timestamp: new Date(Date.now() - 30000).toISOString() },
];

export const initialNotifications: Notification[] = [
  { id: 'n1', title: 'New Submission', message: 'Julianne submitted Ethics Thesis.', time: '5m ago', read: false, type: 'assignment' },
  { id: 'n2', title: 'System Engine', message: 'Luminous LLM optimized overnight.', time: '1h ago', read: true, type: 'system' }
];

export const initialAnnouncements: Announcement[] = [
  { id: 'an1', courseId: 'c1', authorName: 'Dr. Alistair Thorne', content: 'Welcome to Macroeconomics! Please review the syllabus I just uploaded before our first lecture.', timestamp: 'Sep 1st' }
];

export const mockUsers: UserProfile[] = [
  { id: 'u1', name: 'Julianne Moore', role: 'student', avatar: 'https://i.pravatar.cc/150?u=jul' },
  { id: 'u2', name: 'Marcus Chen', role: 'student', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 'u3', name: 'Sarah Jenkins', role: 'student', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'p1', name: 'Dr. Alistair Thorne', role: 'professor', avatar: 'https://i.pravatar.cc/150?u=doc' }
];
