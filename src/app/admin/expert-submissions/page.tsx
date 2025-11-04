/**
 * Expert Submissions Admin Dashboard (Recommendation #4)
 * Allows admins to review and approve expert-submitted templates
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function ExpertSubmissionsPage() {
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
                href="/admin/health"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                System Health
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Dashboard
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
          <h2 className="text-2xl font-bold text-gray-900">Expert Template Submissions</h2>
          <p className="mt-1 text-sm text-gray-600">
            Review and approve templates submitted by experts
          </p>
        </div>

        <div className="space-y-4">
          <SubmissionsList status="pending" />
        </div>
      </main>
    </div>
  )
}

async function SubmissionsList({ status }: { status: string }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return (
      <div className="text-sm text-gray-500">
        Database connection not configured
      </div>
    )
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/expert_submissions?status=eq.${status}&order=created_at.desc`,
    {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to load submissions: ${response.statusText}`)
  }

  const submissions = await response.json()

  if (submissions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          No pending submissions
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission: any) => (
        <div
          key={submission.id}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {submission.template_name}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {submission.template_description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Expert:</span>
                  <span className="ml-2 text-gray-600">{submission.expert_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{submission.expert_email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Questions:</span>
                  <span className="ml-2 text-gray-600">
                    {Array.isArray(submission.template_questions)
                      ? submission.template_questions.length
                      : 0} questions
                  </span>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                  View Questions
                </summary>
                <pre className="mt-2 rounded bg-gray-50 p-4 text-xs overflow-x-auto">
                  {JSON.stringify(submission.template_questions, null, 2)}
                </pre>
              </details>
            </div>

            <div className="ml-6 flex flex-col gap-2">
              <form action={approveSubmission}>
                <input type="hidden" name="submissionId" value={submission.id} />
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Approve
                </button>
              </form>

              <form action={rejectSubmission}>
                <input type="hidden" name="submissionId" value={submission.id} />
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function approveSubmission(formData: FormData) {
  'use server'

  const submissionId = formData.get('submissionId') as string
  const { user } = await getUser()

  if (!user) return

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) return

  // Update submission status
  await fetch(
    `${supabaseUrl}/rest/v1/expert_submissions?id=eq.${submissionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      }),
    }
  )

  // TODO: Create template from submission
  // TODO: Log audit event

  console.log('Submission approved:', submissionId)
}

async function rejectSubmission(formData: FormData) {
  'use server'

  const submissionId = formData.get('submissionId') as string
  const { user } = await getUser()

  if (!user) return

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) return

  // Update submission status
  await fetch(
    `${supabaseUrl}/rest/v1/expert_submissions?id=eq.${submissionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      }),
    }
  )

  console.log('Submission rejected:', submissionId)
}
