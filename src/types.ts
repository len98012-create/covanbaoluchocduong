export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: React.ReactNode;
}

export type QuizType = 'multiple-choice' | 'true-false';

export interface QuizConfig {
  topic: string;
  type: QuizType;
  count: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
