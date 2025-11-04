/**
 * useQuestionValidation Hook
 * Validation logic for form builder
 * Addresses Issue #8: Extract validation logic
 */

import { Question } from '@/types'

export interface ValidationError {
  field: string
  message: string
}

export function useQuestionValidation() {
  const validateQuestion = (question: Question): ValidationError[] => {
    const errors: ValidationError[] = []

    // Check question text
    if (!question.text || question.text.trim() === '') {
      errors.push({
        field: 'text',
        message: 'Question text is required',
      })
    }

    // Check options for multiple choice and rating
    if (question.type === 'multiple_choice' || question.type === 'rating') {
      if (!question.options || question.options.length === 0) {
        errors.push({
          field: 'options',
          message: 'At least one option is required',
        })
      }

      // Check for empty options
      const hasEmptyOptions = question.options?.some(
        (option) => !option || option.trim() === ''
      )
      if (hasEmptyOptions) {
        errors.push({
          field: 'options',
          message: 'Options cannot be empty',
        })
      }

      // Check for duplicate options
      const uniqueOptions = new Set(question.options)
      if (uniqueOptions.size !== question.options?.length) {
        errors.push({
          field: 'options',
          message: 'Duplicate options are not allowed',
        })
      }
    }

    return errors
  }

  const validateQuestionnaire = (questions: Question[]): Record<string, ValidationError[]> => {
    const allErrors: Record<string, ValidationError[]> = {}

    questions.forEach((question) => {
      const errors = validateQuestion(question)
      if (errors.length > 0) {
        allErrors[question.id] = errors
      }
    })

    return allErrors
  }

  return {
    validateQuestion,
    validateQuestionnaire,
  }
}
