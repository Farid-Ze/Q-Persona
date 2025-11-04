import Link from 'next/link'
import { getUser } from '@/app/actions/auth'

export default async function Home() {
  const { user } = await getUser()
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Q-Persona</h1>
          <div className="flex gap-4 items-center">
            <Link 
              href="/marketplace"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Marketplace
            </Link>
            <Link 
              href="/enterprise"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Enterprise
            </Link>
            <Link 
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Pricing
            </Link>
            {user ? (
              <Link 
                href="/dashboard"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link 
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
        
        <p className="mb-4">Lean Service-Based Architecture</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Manage user accounts and authentication</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Personas</h2>
            <p className="text-gray-600">Create and manage user personas</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Templates</h2>
            <p className="text-gray-600">Design questionnaire templates</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Questionnaires</h2>
            <p className="text-gray-600">Create and deploy questionnaires</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Respondents</h2>
            <p className="text-gray-600">Manage survey respondents</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Answers</h2>
            <p className="text-gray-600">Collect and analyze responses</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Architecture Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Next.js Frontend (React with SSR/SSG)</li>
            <li>Supabase Backend (Authentication & Database)</li>
            <li>Server Actions for type-safe mutations</li>
            <li>PostgreSQL Database</li>
            <li>Modern authentication system</li>
          </ul>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Enterprise-Grade Security Built In</h3>
              <p className="text-blue-100 mb-4">
                Complete audit logging, SSO integration, and compliance documentation for regulated industries
              </p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete audit trail with immutable logging
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GDPR compliant • HIPAA ready • SOC 2 in progress
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSO (SAML, OAuth) • Multi-factor authentication
                </li>
              </ul>
            </div>
            <div className="ml-8">
              <Link
                href="/enterprise"
                className="inline-block rounded-lg bg-white px-6 py-3 text-blue-600 font-semibold hover:bg-gray-100 transition"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
