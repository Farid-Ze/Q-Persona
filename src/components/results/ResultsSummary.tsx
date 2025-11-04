'use client'

/**
 * ResultsSummary Component
 * High-level metrics and KPIs for questionnaire results
 * Addresses Issue #6: Deliver insights, not just data
 */

interface ResultsSummaryProps {
  totalResponses: number
  completionRate: number
  averageTime: number
  responseRate?: number
  lastUpdated: Date
  // Recommendation #3: Benchmarking data
  benchmarkCategory?: string
  averageScore?: number
  benchmarkComparison?: {
    percentile: number
    sampleSize: number
  }
}

export function ResultsSummary({
  totalResponses,
  completionRate,
  averageTime,
  responseRate,
  lastUpdated,
  benchmarkCategory,
  averageScore,
  benchmarkComparison,
}: ResultsSummaryProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  const stats = [
    {
      label: 'Total Responses',
      value: totalResponses.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'blue',
      trend: totalResponses > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: completionRate >= 70 ? 'green' : completionRate >= 50 ? 'yellow' : 'red',
      trend: completionRate >= 70 ? 'up' : 'down',
    },
    {
      label: 'Avg. Completion Time',
      value: formatTime(averageTime),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'purple',
      trend: 'neutral',
    },
    ...(responseRate !== undefined
      ? [
        {
          label: 'Response Rate',
          value: `${responseRate.toFixed(1)}%`,
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          ),
          color: 'indigo',
          trend: responseRate >= 20 ? 'up' : 'down',
        },
      ]
      : []),
  ]

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Results Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}
              >
                {stat.icon}
              </div>
              {stat.trend !== 'neutral' && (
                <div
                  className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {stat.trend === 'up' ? '↑' : '↓'}
                </div>
              )}
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Insights</h3>
        <div className="space-y-2">
          {completionRate >= 70 && (
            <div className="flex items-start gap-2 text-sm text-green-700">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Excellent completion rate! Your questionnaire is well-designed.</span>
            </div>
          )}
          {completionRate < 50 && (
            <div className="flex items-start gap-2 text-sm text-red-700">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Low completion rate. Consider shortening your questionnaire.</span>
            </div>
          )}
          {averageTime > 300 && (
            <div className="flex items-start gap-2 text-sm text-yellow-700">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Average completion time is over 5 minutes. This might be too long.</span>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark Comparison - Recommendation #3 */}
      {benchmarkComparison && averageScore !== undefined && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📊 Industry Benchmark Comparison
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium mb-2">
                  Your average score: <span className="text-xl font-bold text-blue-600">{averageScore.toFixed(1)}</span>
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  This places you at the <span className="font-bold text-blue-700">{benchmarkComparison.percentile}th percentile</span> compared to{' '}
                  <span className="font-semibold">{benchmarkComparison.sampleSize.toLocaleString()}</span> other responses{' '}
                  {benchmarkCategory && `using '${benchmarkCategory.replace(/_/g, ' ')}' templates`}.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {benchmarkComparison.percentile >= 75
                      ? 'Excellent performance - you\'re in the top quartile!'
                      : benchmarkComparison.percentile >= 50
                        ? 'Good performance - above average.'
                        : benchmarkComparison.percentile >= 25
                          ? 'Room for improvement - below average.'
                          : 'Consider reviewing your approach - bottom quartile.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
