import { getUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

/**
 * Workspace Members Management Page
 * Addresses Risk #3: Seat management for B2B billing
 * 
 * Admins can:
 * - View all workspace members
 * - Invite new members (adds seats)
 * - Remove members (reduces seats)
 * - Change member roles
 * - Billing automatically updates based on seat count
 */

export default async function WorkspaceMembersPage() {
  const { user } = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // TODO: Fetch actual workspace and members from database
  const workspace = {
    id: 'workspace-1',
    name: "Andi's Workspace",
    plan_type: 'business' as const,
    owner_id: user.id,
  }

  const members = [
    {
      id: '1',
      user_id: user.id,
      user_name: 'Andi (You)',
      user_email: 'andi@startup.com',
      role: 'admin' as const,
      joined_at: new Date('2025-01-01'),
    },
    {
      id: '2',
      user_id: 'user-2',
      user_name: 'Siti',
      user_email: 'siti@startup.com',
      role: 'editor' as const,
      joined_at: new Date('2025-01-15'),
    },
    {
      id: '3',
      user_id: 'user-3',
      user_name: 'Budi (Intern)',
      user_email: 'budi.intern@startup.com',
      role: 'viewer' as const,
      joined_at: new Date('2025-02-01'),
    },
  ]

  const seatCount = members.length
  const maxSeats = workspace.plan_type === 'business' ? 100 : 1

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-2 text-gray-600">
            Manage your workspace members and their access levels
          </p>
        </div>

        {/* Seat Usage Card */}
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Seat Usage
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {seatCount} of {maxSeats} seats used
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${seatCount * 50}/month
              </div>
              <p className="text-sm text-gray-600">
                $50 per seat
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(seatCount / maxSeats) * 100}%` }}
              />
            </div>
          </div>

          {workspace.plan_type === 'business' && (
            <p className="mt-3 text-sm text-gray-500">
              Adding or removing members will automatically update your billing.
              Changes are prorated to your next billing cycle.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Invite Member
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {member.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.user_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.user_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      defaultValue={member.role}
                      disabled={member.user_id === user.id}
                      className="text-sm rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.joined_at.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      $50/mo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.user_id !== user.id && (
                      <button className="text-red-600 hover:text-red-900">
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Admin</h3>
            <p className="text-sm text-blue-700">
              Full control over workspace, billing, and members
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Editor</h3>
            <p className="text-sm text-green-700">
              Can create and edit questionnaires and templates
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Viewer</h3>
            <p className="text-sm text-gray-700">
              Read-only access to all workspace content
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
