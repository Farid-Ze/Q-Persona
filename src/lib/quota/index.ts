/**
 * Quota Management Library (Recommendation #2)
 * Checks and enforces usage quotas based on subscription plans
 */

export interface QuotaCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  percentage: number;
  message?: string;
}

/**
 * Check if workspace has exceeded response quota
 */
export async function checkResponseQuota(
  workspaceId: string,
  questionnaireId: string
): Promise<QuotaCheckResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    // If DB not configured, allow by default
    return {
      allowed: true,
      current: 0,
      limit: Infinity,
      percentage: 0,
    };
  }
  
  try {
    // Get subscription limits
    const subResponse = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?workspace_id=eq.${workspaceId}&limit=1`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    );
    
    if (!subResponse.ok) {
      return { allowed: true, current: 0, limit: Infinity, percentage: 0 };
    }
    
    const subscriptions = await subResponse.json();
    
    if (subscriptions.length === 0) {
      // No subscription, use free tier defaults
      return checkQuotaWithLimit(questionnaireId, 100);
    }
    
    const subscription = subscriptions[0];
    const limit = subscription.max_responses_per_month || 100;
    
    return checkQuotaWithLimit(questionnaireId, limit);
    
  } catch (error) {
    console.error('Failed to check quota:', error);
    // On error, allow by default to avoid blocking users
    return { allowed: true, current: 0, limit: Infinity, percentage: 0 };
  }
}

/**
 * Check quota against a specific limit
 */
async function checkQuotaWithLimit(
  questionnaireId: string,
  limit: number
): Promise<QuotaCheckResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    return { allowed: true, current: 0, limit, percentage: 0 };
  }
  
  // Count current responses for this questionnaire this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const countResponse = await fetch(
    `${supabaseUrl}/rest/v1/answers?questionnaire_id=eq.${questionnaireId}&created_at=gte.${startOfMonth.toISOString()}&select=id`,
    {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Range': '0-0',
        'Prefer': 'count=exact',
      },
    }
  );
  
  const contentRange = countResponse.headers.get('content-range');
  const current = contentRange ? parseInt(contentRange.split('/')[1]) : 0;
  
  const percentage = (current / limit) * 100;
  const allowed = current < limit;
  
  return {
    allowed,
    current,
    limit,
    percentage,
    message: allowed 
      ? undefined 
      : `Quota exceeded: ${current}/${limit} responses used this month`,
  };
}

/**
 * Check if workspace can create more questionnaires
 */
export async function checkQuestionnaireQuota(
  workspaceId: string
): Promise<QuotaCheckResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    return { allowed: true, current: 0, limit: Infinity, percentage: 0 };
  }
  
  try {
    // Get subscription limits
    const subResponse = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?workspace_id=eq.${workspaceId}&limit=1`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    );
    
    if (!subResponse.ok) {
      return { allowed: true, current: 0, limit: Infinity, percentage: 0 };
    }
    
    const subscriptions = await subResponse.json();
    const limit = subscriptions.length > 0 
      ? subscriptions[0].max_questionnaires || 5
      : 5;
    
    // Count current questionnaires
    const countResponse = await fetch(
      `${supabaseUrl}/rest/v1/questionnaires?workspace_id=eq.${workspaceId}&select=id`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Range': '0-0',
          'Prefer': 'count=exact',
        },
      }
    );
    
    const contentRange = countResponse.headers.get('content-range');
    const current = contentRange ? parseInt(contentRange.split('/')[1]) : 0;
    
    const percentage = (current / limit) * 100;
    const allowed = current < limit;
    
    return {
      allowed,
      current,
      limit,
      percentage,
      message: allowed 
        ? undefined 
        : `Quota exceeded: ${current}/${limit} questionnaires created`,
    };
    
  } catch (error) {
    console.error('Failed to check questionnaire quota:', error);
    return { allowed: true, current: 0, limit: Infinity, percentage: 0 };
  }
}
