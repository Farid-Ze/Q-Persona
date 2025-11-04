/**
 * Multi-Factor Authentication (MFA) Settings
 * Allows users to enable/disable 2FA for their account
 */

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function SecuritySettingsPage() {
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

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account security and two-factor authentication
          </p>
        </div>

        <div className="space-y-6">
          {/* MFA Status */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <MFAStatus userId={user.id} />
          </div>

          {/* Security Information */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Why Enable Two-Factor Authentication?
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Adds an extra layer of security beyond just your password
              </li>
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Protects your account even if your password is compromised
              </li>
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Required for enterprise customers and sensitive data access
              </li>
              <li className="flex items-start">
                <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Works with popular authenticator apps like Google Authenticator, Authy
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

async function MFAStatus({ userId }: { userId: string }) {
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
    `${supabaseUrl}/rest/v1/user_mfa?user_id=eq.${userId}`,
    {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to load MFA status: ${response.statusText}`)
  }

  const mfaRecords = await response.json()
  const mfaEnabled = mfaRecords.length > 0 && mfaRecords[0].mfa_enabled

  if (mfaEnabled) {
    return <MFAEnabledView mfa={mfaRecords[0]} />
  } else {
    return <MFADisabledView userId={userId} />
  }
}

function MFAEnabledView({ mfa }: { mfa: any }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
          <p className="mt-1 text-sm text-gray-600">
            Your account is protected with 2FA
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          ✓ Enabled
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-md bg-gray-50 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Methods</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Authenticator App (TOTP)
            </li>
            {mfa.phone_verified && (
              <li className="flex items-center text-sm text-gray-700">
                <svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SMS ({mfa.phone_number})
              </li>
            )}
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Backup Codes
          </button>
          <button
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Disable 2FA
          </button>
        </div>
      </div>
    </div>
  )
}

function MFADisabledView({ userId }: { userId: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
          <p className="mt-1 text-sm text-gray-600">
            Add an extra layer of security to your account
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          Not Enabled
        </span>
      </div>

      <div className="space-y-6">
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Recommended: Enable Two-Factor Authentication
              </h4>
              <p className="mt-1 text-sm text-yellow-700">
                Protect your account and sensitive data with an additional security layer.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Choose a Method:</h4>

          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-between rounded-md border border-gray-300 p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4 text-left">
                  <h5 className="text-sm font-medium text-gray-900">Authenticator App</h5>
                  <p className="text-xs text-gray-600">Use Google Authenticator, Authy, or similar</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className="w-full flex items-center justify-between rounded-md border border-gray-300 p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="ml-4 text-left">
                  <h5 className="text-sm font-medium text-gray-900">SMS Verification</h5>
                  <p className="text-xs text-gray-600">Receive codes via text message</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
