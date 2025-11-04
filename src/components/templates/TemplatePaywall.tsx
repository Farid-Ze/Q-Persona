'use client'

/**
 * TemplatePaywall Component
 * Displays upgrade prompt when free users reach question limit
 * Addresses Issue #7: IP Protection through technical friction
 */

import Link from 'next/link'

interface TemplatePaywallProps {
  remainingQuestions: number
  templateName?: string
}

export function TemplatePaywall({ remainingQuestions, templateName }: TemplatePaywallProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Unlock {remainingQuestions} More Validated Questions
        </h3>

        <p className="text-gray-600 mb-6">
          {templateName ? `"${templateName}" contains ` : 'This template contains '}
          {remainingQuestions} additional expert-validated questions.
          Upgrade to Pro to access the complete template.
        </p>

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Upgrade to Pro - $10/month
          </Link>

          <button
            className="block w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            See Full Question List
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Pro Plan Benefits:</p>
            <ul className="text-left space-y-1 max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Access all expert-validated templates</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Advanced analytics & insights</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Export to Excel & SPSS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
