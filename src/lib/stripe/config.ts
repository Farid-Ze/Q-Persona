import Stripe from 'stripe'

/**
 * Stripe client configuration
 * Server-side only
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

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
