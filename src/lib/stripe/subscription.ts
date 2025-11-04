'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from './config'
import { trackSubscriptionStarted } from '@/lib/analytics/server'

/**
 * Subscription management utilities
 */

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const supabase = await createClient()

  // Get or create Stripe customer
  let customerId: string | undefined

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  if (subscription?.stripe_customer_id) {
    customerId = subscription.stripe_customer_id
  } else {
    // Get user email
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      throw new Error('User email not found')
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        user_id: userId,
      },
    })

    customerId = customer.id

    // Save customer ID
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
      })
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
    },
  })

  return session
}

export async function createPortalSession(userId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  if (!subscription?.stripe_customer_id) {
    throw new Error('No Stripe customer found')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscriptionStatus(userId: string) {
  const supabase = await createClient()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !subscription) {
    return {
      status: 'inactive',
      plan_type: 'free',
    }
  }

  return subscription
}

export async function updateSubscriptionStatus(
  userId: string,
  subscriptionData: {
    stripe_subscription_id: string
    stripe_price_id: string
    status: string
    current_period_start: number
    current_period_end: number
    cancel_at_period_end: boolean
  }
) {
  const supabase = await createClient()

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    'active': 'active',
    'trialing': 'trialing',
    'past_due': 'past_due',
    'canceled': 'canceled',
    'unpaid': 'inactive',
  }

  const mappedStatus = statusMap[subscriptionData.status] || 'inactive'

  // Determine plan type based on price ID
  let planType = 'free'
  if (subscriptionData.stripe_price_id === process.env.STRIPE_PRICE_PRO) {
    planType = 'pro'
  } else if (subscriptionData.stripe_price_id === process.env.STRIPE_PRICE_BUSINESS) {
    planType = 'business'
  }

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionData.stripe_subscription_id,
      stripe_price_id: subscriptionData.stripe_price_id,
      status: mappedStatus,
      plan_type: planType,
      current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscriptionData.cancel_at_period_end,
    })

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }

  // Track subscription event
  if (mappedStatus === 'active') {
    // TODO: Get actual amount from Stripe subscription or invoice
    // For now, we track the event without the amount
    await trackSubscriptionStarted(userId, planType, 0)
  }
}
