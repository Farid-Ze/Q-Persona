/**
 * Database Schema Types for Q-Persona
 * PostgreSQL schema: Users → Persona → Templates → Questionnaire → Respondents → Answers
 */

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Persona {
  id: string;
  user_id: string;
  name: string;
  description: string;
  attributes: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Template {
  id: string;
  persona_id: string;
  name: string;
  description: string;
  questions: Question[];
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'boolean';
  options?: string[];
  required: boolean;
  order: number;
}

export interface Questionnaire {
  id: string;
  template_id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Respondent {
  id: string;
  questionnaire_id: string;
  email?: string;
  name?: string;
  metadata: Record<string, any>;
  started_at: Date;
  completed_at?: Date;
}

export interface Answer {
  id: string;
  respondent_id: string;
  question_id: string;
  value: any;
  created_at: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
