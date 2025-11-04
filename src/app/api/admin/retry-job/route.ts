/**
 * API endpoint to retry failed jobs (Recommendation #1)
 * Allows admin users to manually reprocess failed jobs
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }
    
    // Fetch the failed job
    const failedJobResponse = await fetch(
      `${supabaseUrl}/rest/v1/failed_jobs?id=eq.${jobId}`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    );
    
    if (!failedJobResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch job' },
        { status: 500 }
      );
    }
    
    const failedJobs = await failedJobResponse.json();
    
    if (failedJobs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    const failedJob = failedJobs[0];
    
    // Re-push to response_queue
    await fetch(`${supabaseUrl}/rest/v1/response_queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        payload: failedJob.payload,
        status: 'pending',
        retry_count: 0,
        created_at: new Date().toISOString(),
      }),
    });
    
    // Update failed_job status to 'resolved'
    await fetch(
      `${supabaseUrl}/rest/v1/failed_jobs?id=eq.${jobId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        }),
      }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Job queued for retry',
    });
    
  } catch (error) {
    console.error('Retry job error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
