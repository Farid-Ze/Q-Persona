/**
 * API Keys Management Page
 * Recommendation #2: UI for managing workspace API keys
 * Allows users to create and manage API keys for external integrations
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function APIKeysPage() {
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
                href="/dashboard/workspace/settings/webhooks"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Webhooks
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
          <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage API keys to access Q-Persona programmatically
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Existing API Keys */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your API Keys</h3>
              <button
                onClick={() => {
                  alert('Create API key functionality coming soon')
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create New Key
              </button>
            </div>
            <APIKeysList userId={user.id} />
          </div>
          
          {/* API Documentation */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Base URL</h4>
                <code className="block bg-gray-100 rounded px-3 py-2 text-sm text-gray-800">
                  https://your-domain.com/api/v1
                </code>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Authentication</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Include your API key in the Authorization header:
                </p>
                <code className="block bg-gray-100 rounded px-3 py-2 text-sm text-gray-800">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Endpoints</h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        GET
                      </span>
                      <code className="text-sm text-gray-800">/api/v1/questionnaires</code>
                    </div>
                    <p className="text-xs text-gray-600">List all questionnaires</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        POST
                      </span>
                      <code className="text-sm text-gray-800">/api/v1/questionnaires</code>
                    </div>
                    <p className="text-xs text-gray-600">Create a new questionnaire</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        GET
                      </span>
                      <code className="text-sm text-gray-800">/api/v1/responses?questionnaire_id=ID</code>
                    </div>
                    <p className="text-xs text-gray-600">Get all responses for a questionnaire</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        POST
                      </span>
                      <code className="text-sm text-gray-800">/api/v1/responses</code>
                    </div>
                    <p className="text-xs text-gray-600">Submit a new response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Best Practices */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h4 className="text-sm font-semibold text-yellow-900 mb-3">
              🔒 Security Best Practices
            </h4>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Never share your API keys publicly or commit them to version control
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Use environment variables to store API keys in your applications
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Rotate API keys regularly and immediately if compromised
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Use the minimum required scopes for each API key
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

async function APIKeysList({ userId }: { userId: string }) {
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
      `${supabaseUrl}/rest/v1/workspace_api_keys?user_id=eq.${userId}&order=created_at.desc`,
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
          Failed to load API keys: {response.statusText}
        </div>
      )
    }
    
    const apiKeys = await response.json()
    
    if (apiKeys.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">
            No API keys created yet
          </p>
          <p className="text-xs text-gray-400">
            Create your first API key to start using the Q-Persona API
          </p>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {apiKeys.map((key: any) => (
          <div
            key={key.id}
            className="flex items-start justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-gray-900">{key.name}</h4>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  key.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {key.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                  {key.key_prefix}••••••••••••
                </code>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Scopes: {Array.isArray(key.scopes) ? key.scopes.join(', ') : 'N/A'}
                </span>
                {key.last_used_at && (
                  <span>
                    Last used: {new Date(key.last_used_at).toLocaleDateString()}
                  </span>
                )}
                {key.expires_at && (
                  <span className={new Date(key.expires_at) < new Date() ? 'text-red-600' : ''}>
                    Expires: {new Date(key.expires_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    return (
      <div className="text-sm text-red-600">
        Error loading API keys: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }
}
