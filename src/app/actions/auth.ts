'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { trackUserSignedUp } from '@/lib/analytics/server'

/**
 * Server Actions for Authentication
 * Following Supabase Auth best practices
 */

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  
  if (error) {
    redirect('/auth/signup?error=' + encodeURIComponent(error.message))
  }
  
  // Track user signup event
  if (data.user) {
    await trackUserSignedUp(data.user.id, email, name)
  }
  
  revalidatePath('/', 'layout')
  // Redirect to onboarding instead of dashboard
  redirect('/onboarding')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }
  
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    return { user: null, error: error.message }
  }
  
  return { user, error: null }
}
