/**
 * Admin Health Dashboard (Recommendation #1)
 * Provides observability into failed jobs and system health
 * Only accessible by Super Admin users
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function AdminHealthPage() {
  const { user } = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // SECURITY WARNING: This page is accessible to all authenticated users
  // TODO: Implement Super Admin role check before production deployment
  // Example: if (user.role !== 'super_admin') { redirect('/dashboard') }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Q-Persona Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Back to Dashboard
              </Link>
              <span className="text-sm text-gray-700">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">System Health Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Monitor failed jobs and system observability
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Failed Jobs Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Failed Jobs</h3>
            <FailedJobsList />
          </div>
          
          {/* System Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Pending Jobs</h4>
              <p className="mt-2 text-3xl font-bold text-gray-900">-</p>
              <p className="mt-1 text-xs text-gray-600">In queue</p>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Failed Jobs</h4>
              <p className="mt-2 text-3xl font-bold text-red-600">-</p>
              <p className="mt-1 text-xs text-gray-600">Need attention</p>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-medium text-gray-500">Processed Today</h4>
              <p className="mt-2 text-3xl font-bold text-green-600">-</p>
              <p className="mt-1 text-xs text-gray-600">Successfully completed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

async function FailedJobsList() {
  // Fetch failed jobs from database
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    return (
      <div className="text-sm text-gray-500">
        Database connection not configured
      </div>
    )
  }
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/failed_jobs?status=eq.failed&order=failed_at.desc&limit=50`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    )
    
    if (!response.ok) {
      return (
        <div className="text-sm text-red-600">
          Failed to load jobs: {response.statusText}
        </div>
      )
    }
    
    const failedJobs = await response.json()
    
    if (failedJobs.length === 0) {
      return (
        <div className="text-sm text-gray-500">
          No failed jobs. System is healthy! ✅
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {failedJobs.map((job: any) => (
          <div
            key={job.id}
            className="rounded-md border border-gray-200 p-4 hover:border-gray-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    {job.queue_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(job.failed_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-red-600">
                  {job.error_message || 'Unknown error'}
                </p>
                {job.payload && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                      View payload
                    </summary>
                    <pre className="mt-2 rounded bg-gray-50 p-2 text-xs overflow-x-auto">
                      {JSON.stringify(job.payload, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              <form action={retryFailedJob}>
                <input type="hidden" name="jobId" value={job.id} />
                <button
                  type="submit"
                  className="ml-4 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Retry
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    return (
      <div className="text-sm text-red-600">
        Error loading failed jobs: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }
}

async function retryFailedJob(formData: FormData) {
  'use server'
  
  const jobId = formData.get('jobId') as string
  
  if (!jobId) {
    console.error('No job ID provided')
    return
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    console.error('Database not configured')
    return
  }
  
  try {
    // 1. Fetch the failed job
    const failedJobResponse = await fetch(
      `${supabaseUrl}/rest/v1/failed_jobs?id=eq.${jobId}`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )
    
    if (!failedJobResponse.ok) {
      throw new Error('Failed to fetch job')
    }
    
    const failedJobs = await failedJobResponse.json()
    
    if (failedJobs.length === 0) {
      console.error('Job not found:', jobId)
      return
    }
    
    const failedJob = failedJobs[0]
    
    // 2. Re-push to response_queue
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
    })
    
    // 3. Update failed_job status to 'resolved'
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
    )
    
    console.log('Job retried successfully:', jobId)
    // TODO: Implement revalidation or redirect to refresh page
    
  } catch (error) {
    console.error('Failed to retry job:', error)
  }
}
