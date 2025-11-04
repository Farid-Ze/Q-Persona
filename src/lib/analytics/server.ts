'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Server-side analytics tracking
 * Stores events in database for backup and analysis
 */

export async function trackServerEvent(
  eventName: string,
  properties?: Record<string, any>,
  userId?: string
) {
  const supabase = await createClient()

  // Get user if not provided
  let currentUserId = userId
  if (!currentUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    currentUserId = user?.id
  }

  const { error } = await supabase
    .from('analytics_events')
    .insert({
      user_id: currentUserId,
      event_name: eventName,
      event_properties: properties || {}
    })

  if (error) {
    console.error('Error tracking event:', error)
  }
}

/**
 * Track key events for the business flywheel
 */
export async function trackUserSignedUp(userId: string, email: string, name: string) {
  await trackServerEvent('user_signed_up', { email, name }, userId)
}

export async function trackPersonaSelected(userId: string, personaId: string, personaName: string) {
  await trackServerEvent('persona_selected', { persona_id: personaId, persona_name: personaName }, userId)
}

export async function trackTemplateUsed(userId: string, templateId: string, templateName: string) {
  await trackServerEvent('template_used', { template_id: templateId, template_name: templateName }, userId)
}

export async function trackSubscriptionStarted(
  userId: string,
  planType: string,
  amount: number
) {
  await trackServerEvent('subscription_started', { plan_type: planType, amount }, userId)
}

export async function trackOnboardingCompleted(userId: string, personasSelected: number) {
  await trackServerEvent('onboarding_completed', { personas_count: personasSelected }, userId)
}
