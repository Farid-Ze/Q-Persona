/**
 * useCollaborationAwareness Hook
 * Addresses Risk #2: Real-time collaboration awareness
 * 
 * Prevents users from overwriting each other's work
 * Shows who is currently editing
 */

'use client'

import { useEffect, useState } from 'react'

interface EditorInfo {
  user_id: string
  user_name: string
  user_email?: string
  started_at: string
}

export function useCollaborationAwareness(
  resourceId: string,
  resourceType: 'questionnaire' | 'template',
  currentUserId: string
) {
  const [currentEditor, setCurrentEditor] = useState<EditorInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    // Subscribe to Supabase Realtime for this resource
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured for realtime')
      return
    }

    // Listen for editing_lock changes
    const channel = `editing:${resourceType}:${resourceId}`

    // TODO: Implement actual Supabase Realtime subscription
    // const subscription = supabase
    //   .channel(channel)
    //   .on('postgres_changes', {
    //     event: '*',
    //     schema: 'public',
    //     table: 'editing_locks',
    //     filter: `resource_id=eq.${resourceId}`
    //   }, (payload) => {
    //     handleEditingLockChange(payload)
    //   })
    //   .subscribe()

    // return () => {
    //   subscription.unsubscribe()
    // }
  }, [resourceId, resourceType, currentUserId])

  const startEditing = async () => {
    // Set editing lock in database
    try {
      const response = await fetch('/api/collaboration/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource_id: resourceId,
          resource_type: resourceType,
          user_id: currentUserId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsEditing(true)
        return true
      } else {
        // Someone else is editing
        setCurrentEditor(data.current_editor)
        return false
      }
    } catch (error) {
      console.error('Failed to acquire editing lock:', error)
      return false
    }
  }

  const stopEditing = async () => {
    // Release editing lock
    try {
      await fetch('/api/collaboration/lock', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource_id: resourceId,
          resource_type: resourceType,
          user_id: currentUserId,
        }),
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to release editing lock:', error)
    }
  }

  const checkForConflicts = async (lastKnownTimestamp: Date): Promise<boolean> => {
    // Pessimistic locking: Check if data has been modified since we loaded it
    try {
      const response = await fetch(
        `/api/${resourceType}s/${resourceId}/timestamp`,
        {
          method: 'GET',
        }
      )

      const data = await response.json()
      const serverTimestamp = new Date(data.updated_at)

      if (serverTimestamp > lastKnownTimestamp) {
        // Data has been modified by someone else
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to check for conflicts:', error)
      return false
    }
  }

  return {
    currentEditor,
    isEditing,
    startEditing,
    stopEditing,
    checkForConflicts,
    canEdit: !currentEditor || currentEditor.user_id === currentUserId,
  }
}
