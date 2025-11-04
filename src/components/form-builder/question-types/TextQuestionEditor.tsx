'use client'

/**
 * TextQuestionEditor Component
 * Modular editor for text questions
 * Addresses Issue #8: Composable question components
 */

import { Question } from '@/types'

interface TextQuestionEditorProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
}

export function TextQuestionEditor({ question, onUpdate }: TextQuestionEditorProps) {
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
          <input
            type="text"
            disabled
            placeholder="Text answer will appear here..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 bg-white"
          />
        </div>
      </div>
    </div>
  )
}
