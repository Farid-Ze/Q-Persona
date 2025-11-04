/**
 * SSO (Single Sign-On) Configuration Page
 * Allows workspace admins to configure SAML and OAuth SSO providers
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { hasFeatureForUser } from '@/lib/billing/features'
import Link from 'next/link'

export default async function SSOSettingsPage() {
  const { user } = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // TODO: Check if user is workspace admin
  // TODO: Get workspace ID from context
  const workspaceId = 'default-workspace'

  // Feature gate: SSO is business-only by default
  const ssoEnabled = await hasFeatureForUser(user.id, 'sso')

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
                href="/dashboard/workspace/settings/audit"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Audit Logs
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
          <h2 className="text-2xl font-bold text-gray-900">Single Sign-On (SSO)</h2>
          <p className="mt-1 text-sm text-gray-600">
            Configure SSO providers for your workspace
          </p>
        </div>

        {!ssoEnabled && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Upgrade to enable SSO</h3>
            <p className="text-sm text-amber-800 mb-4">
              SSO is available on the Business plan. Upgrade to enable SAML/OAuth provider configuration and enterprise controls.
            </p>
            <a
              href="/dashboard/billing/upgrade"
              className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              View plans
            </a>
          </div>
        )}

        <div className="space-y-6">
          {/* SSO Connections List */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SSO Connections</h3>
            {ssoEnabled ? (
              <SSOConnectionsList workspaceId={workspaceId} />
            ) : (
              <div className="text-sm text-gray-500">SSO is disabled on your current plan.</div>
            )}
          </div>

          {/* Add New Connection */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Connection</h3>
            {ssoEnabled ? (
              <AddSSOConnectionForm workspaceId={workspaceId} />
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-md bg-gray-200 px-4 py-3 text-sm font-medium text-gray-500"
                title="Upgrade to enable SSO"
              >
                Create SSO Connection (Upgrade required)
              </button>
            )}
          </div>

          {/* SSO Information */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              About Single Sign-On
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Users can sign in with their organization credentials
              </li>
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Automatic user provisioning (JIT)
              </li>
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Centralized access control and security
              </li>
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Enterprise-grade authentication
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

async function SSOConnectionsList({ workspaceId }: { workspaceId: string }) {
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
    `${supabaseUrl}/rest/v1/sso_connections?workspace_id=eq.${workspaceId}&order=created_at.desc`,
    {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to load SSO connections: ${response.statusText}`)
  }

  const connections = await response.json()

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          No SSO connections configured yet
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {connections.map((conn: any) => (
        <div
          key={conn.id}
          className="flex items-center justify-between rounded-md border border-gray-200 p-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{conn.name}</h4>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${conn.enabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {conn.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Provider: {conn.provider.toUpperCase()}
              {conn.auto_provision && ' • Auto-provisioning enabled'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              Configure
            </button>
            <button
              className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Test
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AddSSOConnectionForm({ workspaceId }: { workspaceId: string }) {
  return (
    <form action={createSSOConnection} className="space-y-6">
      <input type="hidden" name="workspaceId" value={workspaceId} />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
            Provider Type *
          </label>
          <select
            id="provider"
            name="provider"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Select provider...</option>
            <option value="saml">SAML 2.0</option>
            <option value="google">Google OAuth</option>
            <option value="microsoft">Microsoft OAuth</option>
            <option value="github">GitHub OAuth</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Connection Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="e.g., Company SSO"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">SAML Configuration</h4>
        <div className="space-y-4">
          <div>
            <label htmlFor="saml_entry_point" className="block text-sm font-medium text-gray-700">
              SAML Entry Point (SSO URL)
            </label>
            <input
              type="url"
              id="saml_entry_point"
              name="saml_entry_point"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://idp.example.com/sso"
            />
          </div>

          <div>
            <label htmlFor="saml_issuer" className="block text-sm font-medium text-gray-700">
              Issuer (Entity ID)
            </label>
            <input
              type="text"
              id="saml_issuer"
              name="saml_issuer"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://idp.example.com"
            />
          </div>

          <div>
            <label htmlFor="saml_cert" className="block text-sm font-medium text-gray-700">
              X.509 Certificate
            </label>
            <textarea
              id="saml_cert"
              name="saml_cert"
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 font-mono"
              placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="auto_provision"
            defaultChecked
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Enable automatic user provisioning (JIT)
          </span>
        </label>
      </div>

      <div>
        <label htmlFor="default_role" className="block text-sm font-medium text-gray-700">
          Default Role for New Users
        </label>
        <select
          id="default_role"
          name="default_role"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create SSO Connection
      </button>
    </form>
  )
}

async function createSSOConnection(formData: FormData) {
  'use server'

  const workspaceId = formData.get('workspaceId') as string
  const provider = formData.get('provider') as string
  const name = formData.get('name') as string
  const auto_provision = formData.get('auto_provision') === 'on'
  const default_role = formData.get('default_role') as string

  // SAML fields
  const saml_entry_point = formData.get('saml_entry_point') as string
  const saml_issuer = formData.get('saml_issuer') as string
  const saml_cert = formData.get('saml_cert') as string

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Database not configured')
    return
  }

  try {
    await fetch(`${supabaseUrl}/rest/v1/sso_connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
        provider,
        name,
        enabled: true,
        saml_entry_point: saml_entry_point || null,
        saml_issuer: saml_issuer || null,
        saml_cert: saml_cert || null,
        auto_provision,
        default_role,
        created_at: new Date().toISOString(),
      }),
    })

    console.log('SSO connection created successfully')
    // TODO: Revalidate page or redirect
  } catch (error) {
    console.error('Failed to create SSO connection:', error)
  }
}
