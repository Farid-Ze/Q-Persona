'use client'

import { useState } from 'react'
import { Question } from '@/types'

interface QuestionnairePreviewProps {
  title: string
  description: string
  questions: Question[]
  onClose: () => void
}

export function QuestionnairePreview({
  title,
  description,
  questions,
  onClose,
}: QuestionnairePreviewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [mode, setMode] = useState<'single' | 'all'>('single')

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const renderQuestionInput = (question: Question) => {
    const value = answers[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full max-w-2xl rounded-md border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Type your answer here..."
            autoFocus
          />
        )

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full max-w-2xl text-left rounded-lg border-2 px-6 py-4 text-lg transition-all ${value === option
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${value === option ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                    {value === option && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )

      case 'rating':
        return (
          <div className="flex gap-3 justify-center">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-16 h-16 rounded-lg border-2 text-xl font-semibold transition-all ${value === option
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )

      case 'boolean':
        return (
          <div className="flex gap-4 justify-center">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`px-12 py-4 rounded-lg border-2 text-lg font-medium transition-all ${value === option
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (mode === 'single' && questions.length > 0) {
    const question = questions[currentQuestion]

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 overflow-auto">
        <div className="min-h-screen flex flex-col">
          <div className="p-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('all')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Show all questions
              </button>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 pb-20">
            <div className="w-full max-w-3xl">
              <div className="mb-8">
                <div className="text-sm font-medium text-blue-600 mb-2">
                  Question {question.order}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {question.text || 'Untitled question'}
                </h2>
                {question.required && (
                  <span className="text-sm text-red-600">* Required</span>
                )}
              </div>

              {renderQuestionInput(question)}
            </div>
          </div>

          <div className="p-6 border-t bg-white">
            <div className="max-w-3xl mx-auto flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1 ? 'Submit' : 'Next →'}
              </button>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-gray-600 mt-1">{description}</p>}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('single')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                One at a time
              </button>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="border-b pb-6 last:border-0">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Q{question.order}</span>
                    {question.required && <span className="text-red-600">*</span>}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {question.text || 'Untitled question'}
                  </h3>
                </div>
                <div className="max-w-2xl">{renderQuestionInput(question)}</div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No questions in this questionnaire yet.
              </div>
            )}
          </div>

          {questions.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <button className="w-full py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">
                Submit Responses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
