import Stripe from 'stripe'

/**
 * Stripe client configuration
 * Server-side only
 */

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables. Stripe features will be disabled.')
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
}) : null

/**
 * Stripe pricing configuration
 * These should match your Stripe dashboard price IDs
 */
export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    priceId: process.env.STRIPE_PRICE_FREE || '',
    features: ['Basic forms', 'Limited responses', 'Basic analytics'],
    limits: {
      questionnaires: 3,
      responses_per_month: 100,
    }
  },
  PRO: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO || '',
    features: ['Unlimited forms', 'Unlimited responses', 'Advanced analytics', 'Data export'],
    limits: {
      questionnaires: -1, // unlimited
      responses_per_month: -1, // unlimited
    }
  },
  BUSINESS: {
    name: 'Business',
    priceId: process.env.STRIPE_PRICE_BUSINESS || '',
    features: ['Everything in Pro', 'Team collaboration', 'Priority support', 'Custom branding'],
    limits: {
      questionnaires: -1, // unlimited
      responses_per_month: -1, // unlimited
    }
  }
} as const

export type PlanType = keyof typeof STRIPE_PLANS
