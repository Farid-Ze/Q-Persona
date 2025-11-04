import Link from 'next/link'
import { getUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function TemplatesPage() {
  const { user } = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Mock templates data
  const templates = [
    {
      id: '1',
      name: 'Customer Satisfaction Survey',
      description: 'Measure customer satisfaction and gather feedback',
      questions_count: 8,
      created_at: new Date('2025-01-15'),
    },
    {
      id: '2',
      name: 'Employee Engagement',
      description: 'Assess employee satisfaction and engagement levels',
      questions_count: 12,
      created_at: new Date('2025-01-10'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create reusable questionnaire templates
            </p>
          </div>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Template
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{template.questions_count} questions</span>
                <span>{new Date(template.created_at).toLocaleDateString()}</span>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded border">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200">
                  Use Template
                </button>
              </div>
            </div>
          ))}

          {/* Empty state for new templates */}
          <Link
            href="/dashboard/templates/new"
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition flex flex-col items-center justify-center text-center min-h-[200px]"
          >
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Create New Template
            </h3>
            <p className="text-sm text-gray-600">
              Start from scratch with a blank template
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
