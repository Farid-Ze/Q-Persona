/**
 * Background Worker for Response Processing
 * Addresses Risk #1: Batch processes queued responses
 * 
 * This cron job runs every minute to:
 * - Fetch pending responses from queue
 * - Batch insert into database (100 at a time)
 * - Update queue status
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-responses",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

const BATCH_SIZE = 100;
const MAX_RETRIES = 3;

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processResponseBatch();
    
    return NextResponse.json({
      success: true,
      processed: result.processed,
      failed: result.failed,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Worker error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Process a batch of pending responses
 */
async function processResponseBatch() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration');
  }

  // Fetch pending responses from queue
  const queueResponse = await fetch(
    `${supabaseUrl}/rest/v1/response_queue?status=eq.pending&order=created_at.asc&limit=${BATCH_SIZE}`,
    {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    }
  );

  if (!queueResponse.ok) {
    throw new Error('Failed to fetch from queue');
  }

  const queueItems = await queueResponse.json();
  
  if (queueItems.length === 0) {
    return { processed: 0, failed: 0 };
  }

  // Mark as processing
  const queueIds = queueItems.map((item: any) => item.id);
  await updateQueueStatus(queueIds, 'processing');

  // Prepare batch inserts
  const respondents = [];
  const answers = [];
  const exceededQuota = [];
  
  for (const item of queueItems) {
    const payload = item.payload;
    
    // Check quota before processing (Recommendation #2)
    // TODO: Implement actual quota check
    // For now, process all items
    const quotaOk = true; // await checkResponseQuota(payload.questionnaire_id)
    
    if (!quotaOk) {
      exceededQuota.push(item.id);
      continue;
    }
    
    // Create respondent record
    respondents.push({
      id: payload.respondent_id,
      questionnaire_id: payload.questionnaire_id,
      email: payload.metadata?.email,
      metadata: payload.metadata || {},
      started_at: payload.metadata?.submitted_at || new Date().toISOString(),
      completed_at: payload.metadata?.submitted_at || new Date().toISOString(),
    });
    
    // Create answer records
    if (Array.isArray(payload.answers)) {
      for (const answer of payload.answers) {
        answers.push({
          respondent_id: payload.respondent_id,
          question_id: answer.question_id,
          value: answer.value,
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  try {
    // Batch insert respondents
    if (respondents.length > 0) {
      await fetch(`${supabaseUrl}/rest/v1/respondents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(respondents),
      });
    }
    
    // Batch insert answers
    if (answers.length > 0) {
      await fetch(`${supabaseUrl}/rest/v1/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(answers),
      });
    }
    
    // Mark as completed
    await updateQueueStatus(queueIds, 'completed');
    
    return { processed: queueItems.length, failed: 0 };
    
  } catch (error) {
    console.error('Batch processing error:', error);
    
    // Log failed jobs to failed_jobs table (Recommendation #1)
    await logFailedJobs(queueItems, error);
    
    // Mark as failed and increment retry count
    await updateQueueStatus(queueIds, 'failed', true);
    
    return { processed: 0, failed: queueItems.length };
  }
}

/**
 * Update queue status
 */
async function updateQueueStatus(
  ids: string[], 
  status: string, 
  incrementRetry: boolean = false
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  const updates: any = {
    status,
    processed_at: new Date().toISOString(),
  };
  
  if (incrementRetry) {
    // This would need a PATCH request with increment logic
    // For now, just mark as failed
  }
  
  // Update all items in batch
  await fetch(
    `${supabaseUrl}/rest/v1/response_queue?id=in.(${ids.join(',')})`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey || '',
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(updates),
    }
  );
}

/**
 * Log failed jobs to failed_jobs table (Recommendation #1)
 */
async function logFailedJobs(queueItems: any[], error: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !serviceKey) return;
  
  const failedJobs = queueItems.map(item => ({
    queue_name: 'response_queue',
    payload: item.payload,
    error_message: error instanceof Error ? error.message : String(error),
    error_stack: error instanceof Error ? error.stack : undefined,
    retry_count: item.retry_count || 0,
    status: 'failed',
  }));
  
  try {
    await fetch(`${supabaseUrl}/rest/v1/failed_jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(failedJobs),
    });
  } catch (logError) {
    console.error('Failed to log failed jobs:', logError);
  }
}
