/**
 * Template Protection Utilities
 * Implements IP protection features for templates
 * Addresses Issue #7: Prevent template theft and unauthorized copying
 */

import { Question } from '@/types';

/**
 * Limit template questions based on user's plan
 * Free users only see first 3-5 questions
 */
export function limitTemplateQuestions(
  questions: Question[],
  userPlan: 'free' | 'pro' | 'business',
  isPreviewMode: boolean = false
): { questions: Question[], isLimited: boolean, remainingCount: number } {
  // Only limit in preview mode for free users
  if (!isPreviewMode || userPlan !== 'free') {
    return {
      questions,
      isLimited: false,
      remainingCount: 0
    };
  }

  const FREE_PREVIEW_LIMIT = 5;
  
  if (questions.length <= FREE_PREVIEW_LIMIT) {
    return {
      questions,
      isLimited: false,
      remainingCount: 0
    };
  }

  return {
    questions: questions.slice(0, FREE_PREVIEW_LIMIT),
    isLimited: true,
    remainingCount: questions.length - FREE_PREVIEW_LIMIT
  };
}

/**
 * CSS classes to prevent text selection and copying
 */
export const COPY_PROTECTION_STYLES = {
  userSelect: 'none' as const,
  WebkitUserSelect: 'none' as const,
  MozUserSelect: 'none' as const,
  msUserSelect: 'none' as const,
};

/**
 * Event handlers to prevent copying
 */
export const COPY_PROTECTION_HANDLERS = {
  onCopy: (e: React.ClipboardEvent) => {
    e.preventDefault();
    return false;
  },
  onCut: (e: React.ClipboardEvent) => {
    e.preventDefault();
    return false;
  },
  onContextMenu: (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  },
  onDragStart: (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  },
};

/**
 * Watermark configuration for public questionnaires
 */
export interface WatermarkConfig {
  text: string;
  enabled: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function getWatermarkConfig(
  userPlan: 'free' | 'pro' | 'business',
  isPublic: boolean = false
): WatermarkConfig {
  // Only show watermark for free and pro plans on public questionnaires
  if (!isPublic) {
    return { text: '', enabled: false };
  }

  if (userPlan === 'business') {
    return { text: '', enabled: false };
  }

  return {
    text: 'Dibuat dengan Q-Persona',
    enabled: true,
    position: 'bottom-right'
  };
}
