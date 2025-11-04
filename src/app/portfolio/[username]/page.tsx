/**
 * Public Research Portfolio Page
 * Addresses Risk #4: Budi-to-Andi flywheel implementation
 * 
 * Allows users to showcase their research publicly
 * Keeps "Budi" engaged after graduation
 * Can be linked on LinkedIn/CV
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // TODO: Fetch actual portfolio from database
  const portfolio = {
    user_name: 'Budi Santoso',
    user_title: 'Research Assistant | Data Science Student',
    user_bio: 'Passionate about user research and data-driven insights',
    user_photo: null,
    projects: [
      {
        id: '1',
        title: 'E-Commerce User Experience Study',
        description: 'Analyzed shopping behavior patterns of 500+ users',
        questionnaire_id: 'q1',
        response_count: 523,
        completion_rate: 89.2,
        key_insights: [
          '67% prefer mobile shopping',
          'Average session time: 8.5 minutes',
          'Checkout abandonment rate: 23%',
        ],
        created_at: new Date('2024-11-15'),
      },
      {
        id: '2',
        title: 'Student Learning Platform Feedback',
        description: 'Collected feedback from university students on digital learning tools',
        questionnaire_id: 'q2',
        response_count: 1247,
        completion_rate: 92.5,
        key_insights: [
          'Video content most preferred (78%)',
          'Mobile app usage up 45%',
          'Interactive quizzes increase engagement',
        ],
        created_at: new Date('2024-09-10'),
      },
    ],
    created_at: new Date('2024-08-01'),
  }

  if (!portfolio) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          {portfolio.user_photo && (
            <Image
              src={portfolio.user_photo}
              alt={portfolio.user_name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
            />
          )}
          {!portfolio.user_photo && (
            <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-white">
                {portfolio.user_name.charAt(0)}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {portfolio.user_name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {portfolio.user_title}
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {portfolio.user_bio}
          </p>

          {/* Stats */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {portfolio.projects.length}
              </div>
              <div className="text-sm text-gray-600">Research Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {portfolio.projects.reduce((sum, p) => sum + p.response_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {(portfolio.projects.reduce((sum, p) => sum + p.completion_rate, 0) / portfolio.projects.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Completion</div>
            </div>
          </div>
        </div>

        {/* Research Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Research
          </h2>

          {portfolio.projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                </div>
                <div className="text-right ml-6">
                  <div className="text-sm text-gray-500">
                    {project.created_at.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {project.response_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Responses Collected</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {project.completion_rate}%
                  </div>
                  <div className="text-sm text-green-700">Completion Rate</div>
                </div>
              </div>

              {/* Key Insights */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {project.key_insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Q-Persona Branding */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-gray-600 mb-2">
            Powered by
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Q-Persona
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Create your own research portfolio
          </p>
        </div>
      </div>
    </div>
  )
}
