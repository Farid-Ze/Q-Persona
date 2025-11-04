/**
 * Audit Logging Library (Recommendation #3)
 * Provides functions to log user actions for compliance and audit trails
 */

import { NextRequest } from 'next/server';

export interface AuditLogParams {
  workspaceId?: string;
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  request?: NextRequest;
}

/**
 * Log an audit event
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.warn('Audit logging disabled: Database not configured');
    return;
  }
  
  const ipAddress = params.request?.headers.get('x-forwarded-for') || 
                   params.request?.headers.get('x-real-ip') || 
                   'unknown';
  
  const userAgent = params.request?.headers.get('user-agent') || 'unknown';
  
  try {
    await fetch(`${supabaseUrl}/rest/v1/audit_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        workspace_id: params.workspaceId,
        user_id: params.userId,
        action: params.action,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        metadata: params.metadata || {},
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

/**
 * Common audit actions
 */
export const AUDIT_ACTIONS = {
  // Questionnaire actions
  QUESTIONNAIRE_CREATED: 'questionnaire.created',
  QUESTIONNAIRE_VIEWED: 'questionnaire.viewed',
  QUESTIONNAIRE_UPDATED: 'questionnaire.updated',
  QUESTIONNAIRE_DELETED: 'questionnaire.deleted',
  QUESTIONNAIRE_PUBLISHED: 'questionnaire.published',
  
  // Template actions
  TEMPLATE_CREATED: 'template.created',
  TEMPLATE_VIEWED: 'template.viewed',
  TEMPLATE_UPDATED: 'template.updated',
  TEMPLATE_DELETED: 'template.deleted',
  
  // Member actions
  MEMBER_INVITED: 'member.invited',
  MEMBER_REMOVED: 'member.removed',
  MEMBER_ROLE_CHANGED: 'member.role_changed',
  
  // Workspace actions
  WORKSPACE_CREATED: 'workspace.created',
  WORKSPACE_UPDATED: 'workspace.updated',
  WORKSPACE_SETTINGS_CHANGED: 'workspace.settings_changed',
  
  // Billing actions
  BILLING_PLAN_CHANGED: 'billing.plan_changed',
  BILLING_PAYMENT_METHOD_ADDED: 'billing.payment_method_added',
  
  // Response actions
  RESPONSE_VIEWED: 'response.viewed',
  RESPONSE_EXPORTED: 'response.exported',
  
  // Admin actions
  FAILED_JOB_RETRIED: 'admin.failed_job_retried',
  EXPERT_SUBMISSION_REVIEWED: 'admin.expert_submission_reviewed',
} as const;

/**
 * Helper to log questionnaire actions
 */
export async function logQuestionnaireAction(
  action: string,
  questionnaireId: string,
  userId: string,
  workspaceId?: string,
  metadata?: Record<string, any>,
  request?: NextRequest
) {
  await logAudit({
    workspaceId,
    userId,
    action,
    resourceType: 'questionnaire',
    resourceId: questionnaireId,
    metadata,
    request,
  });
}

/**
 * Helper to log workspace member actions
 */
export async function logMemberAction(
  action: string,
  memberId: string,
  userId: string,
  workspaceId: string,
  metadata?: Record<string, any>,
  request?: NextRequest
) {
  await logAudit({
    workspaceId,
    userId,
    action,
    resourceType: 'workspace_member',
    resourceId: memberId,
    metadata,
    request,
  });
}
