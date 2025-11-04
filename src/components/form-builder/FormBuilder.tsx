'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableQuestion } from './SortableQuestion'
import { Question } from '@/types'

interface FormBuilderProps {
  questions: Question[]
  onQuestionsChange: (questions: Question[]) => void
}

export function FormBuilder({ questions, onQuestionsChange }: FormBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)

      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex).map(
        (q, index) => ({ ...q, order: index + 1 })
      )

      onQuestionsChange(reorderedQuestions)
    }
  }

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text: '',
      type,
      required: false,
      order: questions.length + 1,
    }

    if (type === 'multiple_choice' || type === 'rating') {
      newQuestion.options = type === 'rating' ? ['1', '2', '3', '4', '5'] : ['Option 1']
    }

    onQuestionsChange([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onQuestionsChange(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    )
  }

  const deleteQuestion = (id: string) => {
    onQuestionsChange(
      questions.filter((q) => q.id !== id).map((q, index) => ({ ...q, order: index + 1 }))
    )
  }

  const duplicateQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `q${Date.now()}`,
        order: questions.length + 1,
      }
      onQuestionsChange([...questions, newQuestion])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => addQuestion('text')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Text Question
        </button>
        <button
          onClick={() => addQuestion('multiple_choice')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Multiple Choice
        </button>
        <button
          onClick={() => addQuestion('rating')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Rating Scale
        </button>
        <button
          onClick={() => addQuestion('boolean')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Yes/No
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {questions.map((question) => (
              <SortableQuestion
                key={question.id}
                question={question}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
                onDuplicate={duplicateQuestion}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {questions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No questions yet. Start building your questionnaire!</p>
          <p className="text-sm text-gray-500">Click the buttons above to add your first question</p>
        </div>
      )}
    </div>
  )
}
