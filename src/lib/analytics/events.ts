/**
 * Analytics events configuration
 * Centralized tracking for business flywheel metrics
 */

export const ANALYTICS_EVENTS = {
  // User lifecycle events
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  
  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  PERSONA_SELECTED: 'persona_selected',
  
  // Core product events
  TEMPLATE_VIEWED: 'template_viewed',
  TEMPLATE_USED: 'template_used',
  QUESTIONNAIRE_CREATED: 'questionnaire_created',
  QUESTIONNAIRE_PUBLISHED: 'questionnaire_published',
  RESPONSE_RECEIVED: 'response_received',
  
  // Monetization events (Budi-to-Andi conversion)
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  PAYMENT_FAILED: 'payment_failed',
  
  // Engagement events
  DASHBOARD_VIEWED: 'dashboard_viewed',
  ANALYTICS_VIEWED: 'analytics_viewed',
  EXPORT_DATA: 'export_data',
} as const

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
