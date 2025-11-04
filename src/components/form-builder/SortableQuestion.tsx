'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Question } from '@/types'
import { useState } from 'react'

interface SortableQuestionProps {
  question: Question
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function SortableQuestion({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
}: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question.id,
  })

  const [isExpanded, setIsExpanded] = useState(true)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const addOption = () => {
    const currentOptions = question.options || []
    onUpdate(question.id, {
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    onUpdate(question.id, { options: newOptions })
  }

  const deleteOption = (index: number) => {
    onUpdate(question.id, {
      options: question.options?.filter((_, i) => i !== index),
    })
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-500">Q{question.order}</span>
          <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
            {question.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => onDuplicate(question.id)}
            className="text-gray-400 hover:text-gray-600"
            title="Duplicate"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="text-red-400 hover:text-red-600"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => onUpdate(question.id, { text: e.target.value })}
              placeholder="Enter your question here..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {(question.type === 'multiple_choice' || question.type === 'rating') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question.type === 'rating' ? 'Rating Options' : 'Answer Options'}
              </label>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    {question.type === 'multiple_choice' && (question.options?.length || 0) > 1 && (
                      <button
                        onClick={() => deleteOption(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {question.type === 'multiple_choice' && (
                  <button
                    onClick={addOption}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add option
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.required}
              onChange={(e) => onUpdate(question.id, { required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
              Required question
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
