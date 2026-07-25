export type UserRole = 'student' | 'teacher' | 'entrepreneur' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  isVerifiedTeacher?: boolean;
  isSubscribedTeacher?: boolean; // PKR 300/mo subscription
  subscriptionRenewsAt?: string;
  bio?: string;
  institutionOrCompany?: string;
}

export interface ClassRoom {
  id: string;
  code: string;
  title: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  description: string;
  studentCount: number;
  bannerGradient: string;
  createdAt: string;
}

export interface NoteFile {
  id: string;
  classId?: string; // Optional if personal note
  title: string;
  fileType: 'pdf' | 'docx' | 'ppt' | 'image' | 'video' | 'text';
  fileSize: string;
  fileUrl?: string;
  contentSnippet: string;
  authorId: string;
  authorName: string;
  category: string;
  downloadsCount: number;
  createdAt: string;
  tags: string[];
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: 'low' | 'medium' | 'high';
  category: 'Study' | 'Teaching' | 'Business' | 'Personal' | 'Project';
  isCompleted: boolean;
  completedAt?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  attachments?: string[];
  rubricText?: string;
  submissionCount: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
  content: string;
  attachmentName?: string;
  status: 'pending' | 'graded';
  score?: number;
  grade?: string;
  aiEvaluation?: {
    scoreOutof100: number;
    letterGrade: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    actionableTips: string[];
    evaluatedAt: string;
  };
  teacherFeedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  classId: string;
  className: string;
  teacherId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  totalPoints: number;
  attemptsCount: number;
  createdAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: string;
  userAnswers: Record<string, number>; // questionId -> optionIndex
  aiFeedback?: {
    overallFeedback: string;
    recommendedTopics: string[];
    feedbackPerQuestion: Array<{
      questionId: string;
      isCorrect: boolean;
      explanation: string;
      studyTip: string;
    }>;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  recipientId?: string; // Direct message
  classId?: string; // Class channel
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'quiz' | 'subscription' | 'message' | 'system' | 'task';
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  classId: string;
  className: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface SubscriptionTransaction {
  id: string;
  teacherId: string;
  teacherName: string;
  amountPKR: number; // 300
  paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Credit Card' | 'Bank Transfer';
  status: 'active' | 'expired' | 'pending';
  date: string;
  renewsOn: string;
}
