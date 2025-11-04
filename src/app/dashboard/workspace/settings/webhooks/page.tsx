/**
 * Webhooks Management Page
 * Recommendation #2: UI for managing outbound webhooks
 * Allows users to configure integrations with external systems
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function WebhooksPage() {
  const { user } = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Q-Persona</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/workspace/settings/sso"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                SSO Settings
              </Link>
              <Link
                href="/dashboard/workspace/members"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Back to Workspace
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
          <h2 className="text-2xl font-bold text-gray-900">Webhooks</h2>
          <p className="mt-1 text-sm text-gray-600">
            Configure webhooks to receive real-time notifications about events in your workspace
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Existing Webhooks */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Webhooks</h3>
              <button
                onClick={() => {
                  // TODO: Open modal to add new webhook
                  alert('Add new webhook functionality coming soon')
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Webhook
              </button>
            </div>
            <WebhooksList userId={user.id} />
          </div>
          
          {/* Webhook Documentation */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Events</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900">response.created</h4>
                <p className="text-sm text-gray-600">
                  Triggered when a new response is submitted to any questionnaire
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900">response.completed</h4>
                <p className="text-sm text-gray-600">
                  Triggered when a respondent completes a questionnaire
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900">questionnaire.created</h4>
                <p className="text-sm text-gray-600">
                  Triggered when a new questionnaire is created
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900">questionnaire.closed</h4>
                <p className="text-sm text-gray-600">
                  Triggered when a questionnaire is closed or completed
                </p>
              </div>
            </div>
          </div>
          
          {/* Integration Examples */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">
              Popular Integrations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-gray-900 mb-2">Slack</h5>
                <p className="text-sm text-gray-600">
                  Get notifications in your team's Slack channel when responses are submitted
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-gray-900 mb-2">Zapier</h5>
                <p className="text-sm text-gray-600">
                  Connect Q-Persona to 5,000+ apps with Zapier automation
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-gray-900 mb-2">Custom System</h5>
                <p className="text-sm text-gray-600">
                  Send data directly to your internal CRM, analytics, or data warehouse
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

async function WebhooksList({ userId }: { userId: string }) {
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
      `${supabaseUrl}/rest/v1/webhooks?user_id=eq.${userId}&order=created_at.desc`,
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
          Failed to load webhooks: {response.statusText}
        </div>
      )
    }
    
    const webhooks = await response.json()
    
    if (webhooks.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">
            No webhooks configured yet
          </p>
          <p className="text-xs text-gray-400">
            Create your first webhook to start receiving event notifications
          </p>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {webhooks.map((webhook: any) => (
          <div
            key={webhook.id}
            className="flex items-start justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-gray-900">{webhook.name}</h4>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  webhook.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {webhook.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 truncate">
                {webhook.target_url}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Events: {Array.isArray(webhook.event_types) ? webhook.event_types.join(', ') : 'N/A'}
                </span>
                <span className="text-green-600">
                  ✓ {webhook.success_count} successful
                </span>
                {webhook.failure_count > 0 && (
                  <span className="text-red-600">
                    ✗ {webhook.failure_count} failed
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                className="rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    return (
      <div className="text-sm text-red-600">
        Error loading webhooks: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }
}
