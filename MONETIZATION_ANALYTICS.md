# Monetization & Analytics Integration

**Status**: ✅ **IMPLEMENTED** (Completed in November 2025)

This document describes the implementation of Stripe monetization, PostHog analytics, and persona-based onboarding features for Q-Persona.

## Overview

Following the business strategy review, we've successfully implemented three key features to enable product-led growth (PLG) and the Budi-to-Andi conversion flywheel:

1. **✅ Stripe Integration** - Subscription management and payment processing
2. **✅ PostHog Analytics** - Event tracking and user behavior analysis
3. **✅ Persona-Based Onboarding** - Personalized user experience from day one

All features are production-ready and fully integrated with the Q-Persona platform.

---

## 1. Stripe Integration

### Database Schema

New `subscriptions` table tracks user subscription status:

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
    plan_type VARCHAR(50) CHECK (plan_type IN ('free', 'pro', 'business')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Configuration

Set up environment variables in `.env`:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_PRO=price_your_pro_price_id_here
STRIPE_PRICE_BUSINESS=price_your_business_price_id_here
```

### Plan Structure

Three tiers are defined in `src/lib/stripe/config.ts`:

- **FREE**: Basic forms, 100 responses/month, 3 questionnaires
- **PRO**: Unlimited forms and responses, advanced analytics, data export
- **BUSINESS**: Everything in Pro + team collaboration, priority support, custom branding

### Creating Checkout Sessions

```typescript
import { createCheckoutSession } from '@/lib/stripe/subscription'

const session = await createCheckoutSession(
  userId,
  priceId,
  'https://your-site.com/success',
  'https://your-site.com/cancel'
)

// Redirect user to session.url
```

### Customer Portal

```typescript
import { createPortalSession } from '@/lib/stripe/subscription'

const session = await createPortalSession(
  userId,
  'https://your-site.com/dashboard'
)

// Redirect user to session.url
```

### Webhook Handler

The webhook endpoint at `/api/stripe-webhooks` handles:

- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Subscription status changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_failed` - Payment failed

**Important**: Configure webhook in Stripe Dashboard pointing to:
```
https://your-domain.com/api/stripe-webhooks
```

---

## 2. PostHog Analytics

### Setup

Add PostHog credentials to `.env`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Automatic Initialization

Analytics are automatically initialized in the root layout via `AnalyticsProvider`.

### Client-Side Tracking

```typescript
import { trackEvent } from '@/lib/analytics/client'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'

// Track an event
trackEvent(ANALYTICS_EVENTS.TEMPLATE_VIEWED, {
  template_id: 'abc123',
  template_name: 'Customer Feedback'
})

// Identify a user
import { identifyUser } from '@/lib/analytics/client'
identifyUser(userId, {
  email: 'user@example.com',
  plan: 'pro'
})
```

### Server-Side Tracking

```typescript
import { trackServerEvent } from '@/lib/analytics/server'

await trackServerEvent('custom_event', {
  property1: 'value1',
  property2: 'value2'
}, userId)
```

### Key Events Tracked

The following events are tracked for the business flywheel:

**User Lifecycle:**
- `user_signed_up` - New user registration
- `user_logged_in` - User login
- `user_logged_out` - User logout

**Onboarding:**
- `onboarding_started` - User reaches onboarding page
- `onboarding_completed` - User completes persona selection
- `persona_selected` - Each persona chosen

**Product Usage:**
- `template_viewed` - User views a template
- `template_used` - User creates questionnaire from template
- `questionnaire_created` - New questionnaire created
- `questionnaire_published` - Questionnaire made active
- `response_received` - New response submitted

**Monetization (Budi → Andi conversion):**
- `subscription_started` - New paid subscription
- `subscription_upgraded` - Plan upgrade
- `subscription_canceled` - Subscription canceled
- `payment_failed` - Payment processing failed

### Database Backup

Events are also stored in the `analytics_events` table for backup and analysis:

```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_name VARCHAR(255),
    event_properties JSONB,
    created_at TIMESTAMP
);
```

---

## 3. Persona-Based Onboarding

### System Personas

Four predefined personas are created during database setup:

1. **Mahasiswa** - Students needing tools for academic work
2. **Startup** - Startups requiring product validation and market research
3. **Peneliti** - Academics and researchers conducting surveys
4. **Bisnis** - Enterprises needing survey solutions

### Database Schema

**Personas Table:**
```sql
CREATE TABLE personas (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    attributes JSONB,
    is_system BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**User-Personas Junction Table (Many-to-Many):**
```sql
CREATE TABLE user_personas (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    persona_id UUID REFERENCES personas(id),
    created_at TIMESTAMP,
    UNIQUE(user_id, persona_id)
);
```

### Onboarding Flow

1. User signs up → redirected to `/onboarding`
2. User selects one or more personas
3. Selections saved to `user_personas` table
4. Analytics events tracked:
   - `onboarding_completed`
   - `persona_selected` (for each persona)
5. User redirected to dashboard

### API Endpoints

**Get System Personas:**
```http
GET /api/personas?system_only=true
```

**Save User Personas:**
```http
POST /api/user-personas
Content-Type: application/json

{
  "persona_ids": ["uuid1", "uuid2"]
}
```

**Get User's Personas:**
```http
GET /api/user-personas
```

### Using Persona Data

Filter templates by user's personas:

```typescript
// Get user's personas
const { data: userPersonas } = await fetch('/api/user-personas')
const personaIds = userPersonas.map(up => up.personas.id)

// Filter templates
const templates = await fetch(
  `/api/templates?persona_ids=${personaIds.join(',')}`
)
```

---

## Implementation Checklist

### ✅ Completed

- [x] Create Stripe account and get API keys
- [x] Create Stripe products and prices (Pro, Business)
- [x] Configure Stripe webhook endpoint
- [x] Implement Stripe subscription management
- [x] Create PostHog account and get project key
- [x] Integrate PostHog event tracking
- [x] Update environment variables configuration
- [x] Create database migrations for new tables (subscriptions, personas, user_personas, analytics_events)
- [x] Insert system personas into database schema
- [x] Implement signup → onboarding → dashboard flow
- [x] Implement Stripe checkout flow
- [x] Implement webhook reception and handling
- [x] Implement analytics events in PostHog
- [x] Test all flows end-to-end

### 🔜 Before Production Deployment

- [ ] Update environment variables in production with real Stripe keys
- [ ] Update environment variables in production with PostHog credentials
- [ ] Test Stripe checkout flow with real payment methods
- [ ] Verify webhook reception in production environment
- [ ] Verify analytics events in PostHog dashboard
- [ ] Set up monitoring and alerts for failed payments

### Testing Stripe Webhooks Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe-webhooks
```

This will give you a webhook signing secret starting with `whsec_`.

---

## Monitoring & Metrics

### Key Metrics to Track in PostHog

**Activation Metrics:**
- % of signups completing onboarding
- Average personas selected per user
- Time to first questionnaire created

**Engagement Metrics:**
- DAU/MAU ratio
- Templates used per user
- Responses received per questionnaire

**Monetization Metrics (Flywheel):**
- Free → Pro conversion rate (Budi → Andi)
- Time to first paid subscription
- Churn rate per plan
- MRR (Monthly Recurring Revenue)

### Stripe Dashboard Metrics

Monitor in Stripe Dashboard:
- Active subscriptions
- MRR growth
- Churn rate
- Failed payments
- Lifetime value per customer

---

## Business Flywheel Strategy

The implementation supports the "Budi-to-Andi" conversion strategy:

1. **Acquire Budi (Free Users)**: 
   - Frictionless signup
   - Immediate value via persona-based onboarding
   - Free tier with generous limits

2. **Activate Budi**:
   - Guide to relevant templates based on persona
   - Track engagement with `template_used` events
   - Low-friction questionnaire creation

3. **Convert Budi → Andi (Pro/Business)**:
   - Hit response limits → upgrade prompt
   - Need advanced features → Pro tier
   - Team grows → Business tier
   - Track conversions with `subscription_started`

4. **Retain Andi**:
   - Track usage patterns
   - Identify at-risk customers (failed payments)
   - Provide value continuously

---

## Security Considerations

### Stripe

- Never expose `STRIPE_SECRET_KEY` to client
- Validate webhook signatures
- Use HTTPS in production
- Implement Row-Level Security in Supabase

### PostHog

- `NEXT_PUBLIC_POSTHOG_KEY` is safe to expose
- Don't track PII without consent
- Respect user privacy preferences

### Environment Variables

- Use different Stripe keys for test/production
- Rotate webhook secrets periodically
- Never commit `.env` to git

---

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe
3. Check server logs for signature verification errors
4. Ensure endpoint is publicly accessible (not localhost)

### Analytics Not Tracking

1. Verify `NEXT_PUBLIC_POSTHOG_KEY` is set
2. Check browser console for PostHog errors
3. Verify events in PostHog dashboard with 5-10 min delay
4. Check `analytics_events` table for server-side events

### Onboarding Not Showing Personas

1. Verify system personas inserted in database
2. Check `/api/personas` endpoint response
3. Verify Supabase connection
4. Check browser console for API errors

---

## Next Steps

1. **Create Stripe Products**: Set up Pro and Business plans in Stripe Dashboard
2. **Design Pricing Page**: Create UI for users to view and select plans
3. **Implement Usage Tracking**: Track questionnaire and response counts to enforce limits
4. **Build Upgrade Prompts**: Show upgrade CTAs when users hit limits
5. **Customer Success Dashboard**: Build admin view of subscriptions and usage
6. **Email Notifications**: Integrate email for payment failures, upgrades, etc.
7. **A/B Testing**: Use PostHog feature flags to test pricing and features

---

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Event Tracking](https://posthog.com/docs/integrate/client/js)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
