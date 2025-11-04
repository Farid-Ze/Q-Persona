'use client'

import posthog from 'posthog-js'

/**
 * PostHog Analytics Client
 * Used for client-side event tracking
 */

let isInitialized = false

export function initPostHog() {
  if (typeof window === 'undefined' || isInitialized) return

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

  if (!apiKey) {
    console.warn('PostHog API key not found. Analytics disabled.')
    return
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug()
      }
    },
  })

  isInitialized = true
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!isInitialized) {
    console.warn('PostHog not initialized. Call initPostHog() first.')
    return
  }

  posthog.capture(eventName, properties)
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (!isInitialized) {
    console.warn('PostHog not initialized. Call initPostHog() first.')
    return
  }

  posthog.identify(userId, traits)
}

export function resetUser() {
  if (!isInitialized) return
  posthog.reset()
}

export { posthog }
