export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  createdAt?: string;
}

export interface KnowledgePoint {
  id: string;
  day: number;
  title: string;
  content: string;
  order: number;
}

export interface Question {
  id: string;
  day: number;
  type: 'practice' | 'exam';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface LearningRecord {
  day: number;
  practiceCount: number;
  practicegroups?: number;
  examScore: number;
  completed: boolean;
  updatedAt: string;
}

export interface PracticeAnswer {
  questionId: string;
  answer: number;
}

export interface ExamAnswer {
  questionId: string;
  answer: number;
}

export interface PracticeResult {
  results: Array<{
    questionId: string;
    yourAnswer: number;
    correctAnswer: number | undefined;
    isCorrect: boolean;
    explanation: string | undefined;
  }>;
  correctCount: number;
  totalCount: number;
  score: number;
}

export interface ExamResult {
  results: Array<{
    questionId: string;
    yourAnswer: number;
    correctAnswer: number | undefined;
    isCorrect: boolean;
    explanation: string | undefined;
  }>;
  correctCount: number;
  totalCount: number;
  score: number;
  completed: boolean;
}

export interface DailyStats {
  day: number;
  studentCount: number;
  totalPracticeCount: number;
  avgExamScore: number;
  completedCount: number;
}

export interface AllRecords {
  _id: string;
  name: string;
  totalPracticeCount: number;
  averageScore: number;
  completedDays: number;
  records: LearningRecord[];
}