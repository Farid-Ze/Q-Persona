'use client'

/**
 * ExportButton Component
 * Provides data export functionality for different formats
 * Addresses Issue #6: Data export for Pro/Business plans
 */

import { useState } from 'react'

interface ExportButtonProps {
  questionnaireId: string
  questionnaireTitle: string
  userPlan: 'free' | 'pro' | 'business'
  totalResponses: number
}

export function ExportButton({
  questionnaireId,
  questionnaireTitle,
  userPlan,
  totalResponses,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const canExport = userPlan === 'pro' || userPlan === 'business'

  const exportFormats = [
    {
      id: 'csv',
      label: 'CSV (Excel)',
      icon: '📊',
      description: 'Compatible with Excel, Google Sheets',
      available: canExport,
    },
    {
      id: 'excel',
      label: 'Excel (.xlsx)',
      icon: '📗',
      description: 'Microsoft Excel format with formatting',
      available: canExport,
    },
    {
      id: 'spss',
      label: 'SPSS (.sav)',
      icon: '📈',
      description: 'For statistical analysis',
      available: userPlan === 'business',
    },
    {
      id: 'json',
      label: 'JSON',
      icon: '🔧',
      description: 'For developers and custom integrations',
      available: canExport,
    },
    {
      id: 'pdf',
      label: 'PDF Report',
      icon: '📄',
      description: 'Visual report with charts and insights',
      available: userPlan === 'business',
    },
  ]

  const handleExport = async (format: string) => {
    if (!canExport && format !== 'csv') {
      // Show upgrade modal
      alert('Upgrade to Pro to export data')
      return
    }

    setIsExporting(true)
    try {
      // Call export API
      const response = await fetch(
        `/api/questionnaires/${questionnaireId}/export?format=${format}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Download file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${questionnaireTitle}-${format}-${Date.now()}.${format === 'excel' ? 'xlsx' : format
        }`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setShowMenu(false)
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting || totalResponses === 0}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {isExporting ? 'Exporting...' : 'Export Data'}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Export Options</h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose your preferred format
              </p>
            </div>

            <div className="p-2">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  disabled={!format.available}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition ${format.available
                      ? 'hover:bg-gray-50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  <span className="text-2xl">{format.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {format.label}
                      </span>
                      {!format.available && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {userPlan === 'free' ? 'Pro' : 'Business'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {format.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {!canExport && (
              <div className="p-4 border-t bg-blue-50">
                <p className="text-sm text-blue-900">
                  <strong>Upgrade to Pro</strong> to export your data in multiple formats.
                </p>
                <button className="mt-2 text-sm text-blue-700 font-medium hover:underline">
                  View plans →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
