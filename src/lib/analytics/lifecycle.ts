/**
 * Email Lifecycle Automation
 * Addresses Risk #4: Budi-to-Andi flywheel
 * 
 * Triggers email campaigns based on user lifecycle events
 * Nurtures "Budi" through career transitions
 */

/**
 * Lifecycle events that trigger email campaigns
 */
export const LIFECYCLE_TRIGGERS = {
  // Student lifecycle
  SUBSCRIPTION_CANCELLED_STUDENT: 'lifecycle:subscription_cancelled:student',
  GRADUATION_APPROACHING: 'lifecycle:graduation_approaching',
  FIRST_JOB_LANDED: 'lifecycle:first_job',
  
  // Career transitions
  PERSONA_CHANGED_TO_STARTUP: 'lifecycle:persona_changed:startup',
  DORMANT_USER_90_DAYS: 'lifecycle:dormant:90_days',
  
  // Re-engagement
  RETURNED_AFTER_PAUSE: 'lifecycle:returned',
  PORTFOLIO_CREATED: 'lifecycle:portfolio_created',
}

/**
 * Email campaign configurations
 */
const EMAIL_CAMPAIGNS = {
  POST_GRADUATION_NURTURE: {
    id: 'post_graduation_nurture',
    trigger: LIFECYCLE_TRIGGERS.SUBSCRIPTION_CANCELLED_STUDENT,
    sequence: [
      {
        delay_days: 0,
        subject: 'Selamat atas kelulusan Anda! 🎓',
        template: 'post_graduation_welcome',
      },
      {
        delay_days: 14,
        subject: 'Templat untuk Wawancara Kerja',
        template: 'job_search_templates',
      },
      {
        delay_days: 90,
        subject: 'Tips Riset untuk Profesional Muda',
        template: 'professional_research_tips',
      },
      {
        delay_days: 180,
        subject: 'Dari Karyawan ke Entrepreneur',
        template: 'startup_transition',
      },
    ],
  },
  
  STARTUP_TRANSITION: {
    id: 'startup_transition',
    trigger: LIFECYCLE_TRIGGERS.PERSONA_CHANGED_TO_STARTUP,
    sequence: [
      {
        delay_days: 0,
        subject: 'Selamat atas startup Anda! 🚀',
        template: 'startup_welcome',
      },
      {
        delay_days: 7,
        subject: 'Riset Pasar untuk Startup',
        template: 'market_research_templates',
      },
      {
        delay_days: 30,
        subject: 'Startup Founder Toolkit + Business Plan Promo',
        template: 'business_plan_offer',
      },
    ],
  },
  
  DORMANT_REACTIVATION: {
    id: 'dormant_reactivation',
    trigger: LIFECYCLE_TRIGGERS.DORMANT_USER_90_DAYS,
    sequence: [
      {
        delay_days: 0,
        subject: 'We miss you! Lihat fitur baru kami',
        template: 'dormant_reactivation',
      },
      {
        delay_days: 30,
        subject: 'Riset Anda masih tersimpan',
        template: 'portfolio_reminder',
      },
      {
        delay_days: 60,
        subject: 'Special comeback offer: 50% off',
        template: 'comeback_discount',
      },
    ],
  },
}

/**
 * Track lifecycle event and trigger email campaign
 */
export async function triggerLifecycleEmail(
  userId: string,
  eventType: string,
  metadata: Record<string, any> = {}
) {
  // Track the event in analytics (PostHog or similar)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventType, {
      user_id: userId,
      ...metadata,
    })
  }

  // Find matching campaign
  const campaign = Object.values(EMAIL_CAMPAIGNS).find(
    (c) => c.trigger === eventType
  )

  if (!campaign) {
    console.log(`No campaign configured for event: ${eventType}`)
    return
  }

  // Enqueue email sequence
  try {
    await fetch('/api/email/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        campaign_id: campaign.id,
        sequence: campaign.sequence,
        metadata,
      }),
    })

    console.log(`Triggered campaign ${campaign.id} for user ${userId}`)
  } catch (error) {
    console.error('Failed to enqueue email campaign:', error)
  }
}

/**
 * Helper function to detect lifecycle transitions
 * Call this when subscription status changes
 */
export async function handleSubscriptionCancellation(
  userId: string,
  persona: string,
  subscriptionData: any
) {
  if (persona === 'Mahasiswa' || persona === 'Student') {
    // Trigger post-graduation nurture sequence
    await triggerLifecycleEmail(
      userId,
      LIFECYCLE_TRIGGERS.SUBSCRIPTION_CANCELLED_STUDENT,
      {
        persona,
        plan_type: subscriptionData.plan_type,
        cancellation_reason: subscriptionData.cancellation_reason,
      }
    )
  }
}

/**
 * Helper function to detect persona changes
 * Call this when user updates their persona
 */
export async function handlePersonaChange(
  userId: string,
  oldPersona: string,
  newPersona: string
) {
  if (newPersona === 'Startup' || newPersona === 'Entrepreneur') {
    // Trigger startup transition sequence
    await triggerLifecycleEmail(
      userId,
      LIFECYCLE_TRIGGERS.PERSONA_CHANGED_TO_STARTUP,
      {
        old_persona: oldPersona,
        new_persona: newPersona,
      }
    )
  }
}

/**
 * Helper function to detect dormant users
 * Should be called by a daily cron job
 */
export async function checkDormantUsers() {
  // TODO: Query database for users who haven't logged in for 90 days
  // and had a Pro subscription
  
  const dormantUsers: any[] = [] // Placeholder
  
  for (const user of dormantUsers) {
    await triggerLifecycleEmail(
      user.id,
      LIFECYCLE_TRIGGERS.DORMANT_USER_90_DAYS,
      {
        last_login: user.last_login,
        previous_plan: user.previous_plan,
      }
    )
  }
}
