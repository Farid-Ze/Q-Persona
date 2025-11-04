import { getUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ResultsSummary } from '@/components/results/ResultsSummary'
import { ResultsChart } from '@/components/results/ResultsChart'
import { ResultsFilters } from '@/components/results/ResultsFilters'
import { ExportButton } from '@/components/results/ExportButton'

/**
 * Results Dashboard Page
 * Addresses Issue #6: Deliver insights, not just forms
 * This is THE KILLER FEATURE that makes "Andi" stay subscribed
 */

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { user } = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { id } = await params

  // TODO: Fetch actual questionnaire and results data from Supabase
  // For now, using mock data structure
  const questionnaire = {
    id: id,
    title: 'Customer Satisfaction Survey',
    description: 'Q4 2024 Customer Feedback',
    status: 'active' as const,
    created_at: new Date('2025-01-01'),
  }

  const resultsData = {
    summary: {
      total_responses: 1247,
      completed_responses: 1089,
      partial_responses: 158,
      completion_rate: 87.3,
      average_time: 185,
      response_rate: 23.4,
      last_updated: new Date(),
    },
    questions: [
      {
        id: 'q1',
        text: 'What is your primary reason for using this product?',
        type: 'multiple_choice' as const,
        data: [
          { label: 'Price', value: 423 },
          { label: 'Features', value: 356 },
          { label: 'Ease of use', value: 201 },
          { label: 'Recommendation', value: 109 },
        ],
      },
      {
        id: 'q2',
        text: 'How likely are you to recommend us? (1-5)',
        type: 'rating' as const,
        data: [
          { label: '1 - Not likely', value: 23 },
          { label: '2', value: 45 },
          { label: '3 - Neutral', value: 98 },
          { label: '4', value: 234 },
          { label: '5 - Very likely', value: 689 },
        ],
      },
      {
        id: 'q3',
        text: 'Would you purchase again?',
        type: 'boolean' as const,
        data: [
          { label: 'Yes', value: 923 },
          { label: 'No', value: 166 },
        ],
      },
    ],
  }

  // Assume user is on Pro plan for demo
  const userPlan = 'pro' as const

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/dashboard" className="hover:text-gray-900">
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/dashboard/questionnaires"
              className="hover:text-gray-900"
            >
              Questionnaires
            </Link>
            <span>/</span>
            <span className="text-gray-900">Results</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {questionnaire.title}
              </h1>
              <p className="mt-2 text-gray-600">
                {questionnaire.description}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </span>
                <span className="text-sm text-gray-500">
                  Created {questionnaire.created_at.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <ExportButton
                questionnaireId={questionnaire.id}
                questionnaireTitle={questionnaire.title}
                userPlan={userPlan}
                totalResponses={resultsData.summary.total_responses}
              />
              <Link
                href={`/dashboard/questionnaires/${questionnaire.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6">
          <ResultsSummary
            totalResponses={resultsData.summary.total_responses}
            completionRate={resultsData.summary.completion_rate}
            averageTime={resultsData.summary.average_time}
            responseRate={resultsData.summary.response_rate}
            lastUpdated={resultsData.summary.last_updated}
          />
        </div>

        {/* Filters - Client Component will handle state */}
        <div className="mb-6">
          <ResultsFilters
            onFilterChange={(filters) => {
              console.log('Filters changed:', filters)
              // TODO: Implement actual filtering
            }}
            totalResponses={resultsData.summary.total_responses}
            filteredResponses={resultsData.summary.total_responses}
          />
        </div>

        {/* Question Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Question-by-Question Analysis
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
                Chart View
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
                Table View
              </button>
            </div>
          </div>

          {resultsData.questions.map((question, index) => (
            <ResultsChart
              key={question.id}
              questionText={`Q${index + 1}. ${question.text}`}
              questionType={question.type}
              data={question.data}
              chartType={
                question.type === 'rating'
                  ? 'bar'
                  : question.type === 'boolean'
                    ? 'pie'
                    : 'bar'
              }
            />
          ))}
        </div>

        {/* Additional Insights Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 AI-Powered Insights (Coming Soon)
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your Net Promoter Score (NPS) of 61.2 is <strong>excellent</strong> - in the top 25% of B2B SaaS products.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>38.8% of respondents</strong> cited &quot;Price&quot; as their primary reason - consider highlighting value proposition in marketing.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Response rate trending upward - <strong>+12% vs. last month</strong>.</span>
            </li>
          </ul>
          <button className="mt-4 text-sm text-blue-700 font-medium hover:underline">
            Upgrade to Business plan for AI insights →
          </button>
        </div>
      </div>
    </div>
  )
}
