'use client'

/**
 * MultipleChoiceQuestionEditor Component
 * Modular editor for multiple choice questions
 * Addresses Issue #8: Composable question components
 */

import { Question } from '@/types'

interface MultipleChoiceQuestionEditorProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
}

export function MultipleChoiceQuestionEditor({
  question,
  onUpdate,
}: MultipleChoiceQuestionEditorProps) {
  const options = question.options || []

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter your question..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
              </div>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addOption}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add option
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Required question</span>
        </label>
      </div>

      {/* Preview */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-900 mb-3">
            {question.text || 'Your question will appear here'}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200"
              >
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                <span className="text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
