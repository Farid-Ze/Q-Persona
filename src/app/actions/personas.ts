'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Server Actions for Persona management
 * Following best practices from Next.js + Supabase patterns
 */

export async function getPersonas(userId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('personas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching personas:', error)
    return { data: null, error: error.message }
  }
  
  return { data, error: null }
}

export async function createPersona(formData: {
  name: string
  description: string
  attributes?: Record<string, any>
}) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: 'Unauthorized' }
  }
  
  const { data, error } = await supabase
    .from('personas')
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      attributes: formData.attributes || {}
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating persona:', error)
    return { data: null, error: error.message }
  }
  
  revalidatePath('/personas')
  return { data, error: null }
}

export async function updatePersona(id: string, formData: {
  name?: string
  description?: string
  attributes?: Record<string, any>
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('personas')
    .update(formData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating persona:', error)
    return { data: null, error: error.message }
  }
  
  revalidatePath('/personas')
  return { data, error: null }
}

export async function deletePersona(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('personas')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting persona:', error)
    return { error: error.message }
  }
  
  revalidatePath('/personas')
  return { error: null }
}
