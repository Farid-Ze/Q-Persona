/**
 * Audit Log Viewer (Recommendation #3)
 * Shows audit trail for workspace activities
 * Only accessible to workspace admins
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function AuditLogPage() {
  const { user } = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // TODO: Get workspace ID from URL params or user context
  // For now using placeholder - MUST BE FIXED before production
  const workspaceId = 'default-workspace' 
  
  // WARNING: This hardcoded value will show incorrect audit logs
  // Implement proper workspace context before deployment
  
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
          <h2 className="text-2xl font-bold text-gray-900">Audit Log</h2>
          <p className="mt-1 text-sm text-gray-600">
            Track all activities in your workspace for compliance and security
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <AuditLogList workspaceId={workspaceId} />
          </div>
        </div>
      </main>
    </div>
  )
}

async function AuditLogList({ workspaceId }: { workspaceId: string }) {
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
    // Fetch audit logs for this workspace
    const response = await fetch(
      `${supabaseUrl}/rest/v1/audit_logs?workspace_id=eq.${workspaceId}&order=created_at.desc&limit=100`,
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
          Failed to load audit logs: {response.statusText}
        </div>
      )
    }
    
    const auditLogs = await response.json()
    
    if (auditLogs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">
            No audit logs yet. Activities will appear here as they occur.
          </p>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
          <div>Timestamp</div>
          <div>User</div>
          <div>Action</div>
          <div>Resource</div>
          <div>Details</div>
        </div>
        
        {auditLogs.map((log: any) => (
          <div
            key={log.id}
            className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 text-sm"
          >
            <div className="text-gray-600">
              {new Date(log.created_at).toLocaleString()}
            </div>
            <div className="text-gray-900">
              {log.user_id ? log.user_id.substring(0, 8) : 'System'}
            </div>
            <div className="font-medium text-gray-900">
              {formatAction(log.action)}
            </div>
            <div className="text-gray-600">
              {log.resource_type && log.resource_id ? (
                <>
                  {log.resource_type}
                  <br />
                  <span className="text-xs text-gray-400">
                    {log.resource_id.substring(0, 8)}
                  </span>
                </>
              ) : (
                '-'
              )}
            </div>
            <div className="text-gray-600">
              {log.metadata && Object.keys(log.metadata).length > 0 ? (
                <details>
                  <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-700">
                    View details
                  </summary>
                  <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              ) : (
                '-'
              )}
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    return (
      <div className="text-sm text-red-600">
        Error loading audit logs: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }
}

function formatAction(action: string): string {
  return action
    .split('.')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
