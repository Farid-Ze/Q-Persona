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
  name: string;
  description: string;
  attributes: Record<string, any>;
  is_system: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPersona {
  id: string;
  user_id: string;
  persona_id: string;
  created_at: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan_type: 'free' | 'pro' | 'business';
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  invited_by?: string;
  invited_at: Date;
  joined_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Expert {
  id: string;
  name: string;
  title?: string;
  affiliation?: string;
  bio?: string;
  photo_url?: string;
  credentials: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  workspace_id?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';
  plan_type: 'free' | 'pro' | 'business';
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  // Quota limits (Recommendation #2)
  max_questionnaires: number;
  max_responses_per_month: number;
  max_api_calls_per_minute: number;
  created_at: Date;
  updated_at: Date;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_name: string;
  event_properties: Record<string, any>;
  created_at: Date;
}

export interface Template {
  id: string;
  persona_id: string;
  workspace_id?: string;
  name: string;
  description: string;
  questions: Question[];
  is_global: boolean;
  validated_by_expert_id?: string;
  validation_date?: Date;
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
  workspace_id?: string;
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

// Failed Jobs (Recommendation #1)
export interface FailedJob {
  id: string;
  queue_name: string;
  payload: any;
  error_message?: string;
  error_stack?: string;
  failed_at: Date;
  retry_count: number;
  max_retries: number;
  status: 'failed' | 'retrying' | 'resolved';
  resolved_at?: Date;
  resolved_by?: string;
}

// Audit Logs (Recommendation #3)
export interface AuditLog {
  id: string;
  workspace_id?: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// Expert Submissions (Recommendation #4)
export interface ExpertSubmission {
  id: string;
  expert_id?: string;
  expert_email: string;
  expert_name: string;
  template_name: string;
  template_description?: string;
  template_questions: Question[];
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: Date;
  review_notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Response Queue
export interface ResponseQueue {
  id: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  created_at: Date;
  processed_at?: Date;
}
