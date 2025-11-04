import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'

export default async function DashboardPage() {
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
              <span className="text-sm text-gray-700">
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your questionnaires and personas
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/personas"
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">Personas</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage user personas for your questionnaires
            </p>
          </Link>
          
          <Link
            href="/dashboard/templates"
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
            <p className="mt-2 text-sm text-gray-600">
              Design reusable questionnaire templates
            </p>
          </Link>
          
          <Link
            href="/dashboard/questionnaires"
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">Questionnaires</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create and deploy questionnaires to collect responses
            </p>
          </Link>
          
          <Link
            href="/dashboard/respondents"
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">Respondents</h3>
            <p className="mt-2 text-sm text-gray-600">
              View and manage survey respondents
            </p>
          </Link>
          
          <Link
            href="/dashboard/answers"
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">Answers</h3>
            <p className="mt-2 text-sm text-gray-600">
              Analyze collected responses and insights
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
