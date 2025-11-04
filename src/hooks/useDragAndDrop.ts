/**
 * useDragAndDrop Hook
 * Extracted drag-and-drop logic from FormBuilder
 * Addresses Issue #8: Refactor FormBuilder for agility
 */

import { useState, useMemo } from 'react'
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
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

export function useDragAndDrop<T extends { id: string; order: number }>(
  items: T[],
  onReorder: (reorderedItems: T[]) => void
) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const reorderedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({ ...item, order: index + 1 })
      )

      onReorder(reorderedItems)
    }
  }

  return {
    sensors,
    handleDragEnd,
  }
}
