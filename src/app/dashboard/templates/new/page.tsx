'use client'

import { useState } from 'react'
import { FormBuilder } from '@/components/form-builder/FormBuilder'
import { QuestionnairePreview } from '@/components/form-builder/QuestionnairePreview'
import { Question } from '@/types'
import Link from 'next/link'

export default function NewTemplatePage() {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState<'build' | 'settings'>('build')

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving template:', {
      name: templateName,
      description: templateDescription,
      questions,
    })
    alert('Template saved! (Integration with backend pending)')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/templates"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {templateName || 'Untitled Template'}
                </h1>
                <p className="text-sm text-gray-500">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Preview
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('build')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'build'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'build' && (
          <div>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Questions
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Drag and drop to reorder questions. Click to edit.
              </p>
            </div>

            <FormBuilder questions={questions} onQuestionsChange={setQuestions} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Template Settings
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Customer Satisfaction Survey"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Describe the purpose of this template..."
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Template Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">
                        Enable conditional logic
                      </label>
                      <p className="text-sm text-gray-500">
                        Show/hide questions based on previous answers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">
                        Allow anonymous responses
                      </label>
                      <p className="text-sm text-gray-500">
                        Respondents don&apos;t need to provide email
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-700">
                        Show progress bar
                      </label>
                      <p className="text-sm text-gray-500">
                        Display completion progress to respondents
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <QuestionnairePreview
          title={templateName || 'Untitled Template'}
          description={templateDescription}
          questions={questions}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
