# Retention & Lifecycle Strategy

This document addresses Issue #3: Building retention features to bridge the "Budi-to-Andi" gap and maintain long-term customer relationships.

## Problem Statement

### The "Budi-to-Andi" Flywheel Risk

**Current Risk:**
- "Budi" (Student) subscribes to Pro plan ($10/month) for thesis research
- After graduation, Budi cancels subscription and forgets Q-Persona
- 4 years later, Budi becomes "Andi" (Startup Founder) but doesn't return
- The flywheel doesn't spin → Low Customer Lifetime Value (CLV)

**Goal:**
Build technical features that keep Budi engaged during life transitions, so he naturally returns as Andi.

## Solution 1: Research Portfolio Feature

### Concept
Give students a reason to keep their Q-Persona account active even after graduation - a professional portfolio of their research work.

### Database Schema

```sql
-- Add to existing schema
CREATE TABLE research_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES research_portfolios(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- 'overview', 'methodology', 'results', 'insights'
    title VARCHAR(255),
    content JSONB, -- Flexible content storage
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_research_portfolios_user_id ON research_portfolios(user_id);
CREATE INDEX idx_research_portfolios_slug ON research_portfolios(slug);
CREATE INDEX idx_portfolio_sections_portfolio_id ON portfolio_sections(portfolio_id);
```

### TypeScript Types

```typescript
export interface ResearchPortfolio {
  id: string;
  user_id: string;
  questionnaire_id: string;
  is_public: boolean;
  slug: string;
  title?: string;
  description?: string;
  featured: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface PortfolioSection {
  id: string;
  portfolio_id: string;
  section_type: 'overview' | 'methodology' | 'results' | 'insights';
  title?: string;
  content: Record<string, any>;
  order_index: number;
  created_at: Date;
}
```

### Features

#### 1. Portfolio Builder
Location: `/dashboard/questionnaires/[id]/portfolio`

Allows users to:
- Convert questionnaire results into shareable portfolio
- Choose which sections to include (methodology, results, insights)
- Customize branding and description
- Generate public URL: `qpersona.com/portfolio/[slug]`

#### 2. Public Portfolio Page
Location: `/portfolio/[slug]`

Public-facing page showing:
- Research title and description
- Methodology overview
- Key findings (visualizations)
- Data insights
- Researcher profile (with Q-Persona branding)

#### 3. Portfolio Management
Location: `/dashboard/portfolio`

Dashboard to:
- View all portfolios
- Edit/update portfolios
- Track views and engagement
- Share on social media (LinkedIn, Twitter)

### Retention Mechanism

**Why it works:**
1. **Professional Value**: Portfolio becomes part of resume/LinkedIn
2. **Ongoing Engagement**: Users check portfolio stats regularly
3. **Network Effect**: Portfolio viewers discover Q-Persona
4. **Brand Association**: Success tied to Q-Persona platform
5. **Low Friction**: Free tier can keep portfolio active

## Solution 2: Lifecycle-Based Email Automation

### Analytics Events for Lifecycle Detection

Extend `src/lib/analytics/events.ts`:

```typescript
// Lifecycle transition events
export const LIFECYCLE_EVENTS = {
  // Student lifecycle
  THESIS_STARTED: 'lifecycle:thesis_started',
  THESIS_COMPLETED: 'lifecycle:thesis_completed',
  GRADUATION_APPROACHING: 'lifecycle:graduation_approaching',
  
  // Career transitions
  JOB_SEARCH_STARTED: 'lifecycle:job_search',
  FIRST_JOB_LANDED: 'lifecycle:first_job',
  CAREER_ADVANCEMENT: 'lifecycle:career_advancement',
  STARTUP_FOUNDED: 'lifecycle:startup_founded',
  
  // Subscription lifecycle
  SUBSCRIPTION_CANCELLED: 'lifecycle:subscription_cancelled',
  SUBSCRIPTION_DOWNGRADED: 'lifecycle:subscription_downgraded',
  SUBSCRIPTION_PAUSED: 'lifecycle:subscription_paused',
  
  // Re-engagement
  RETURNED_AFTER_PAUSE: 'lifecycle:returned',
  UPGRADED_AFTER_RETURN: 'lifecycle:upgraded_after_return',
};
```

### Automated Email Campaigns

#### Campaign 1: Post-Graduation Nurture
**Trigger:** `subscription_cancelled` + user persona = 'Mahasiswa'

**Email Sequence:**
1. **Day 0**: "Selamat atas kelulusan Anda!" + Keep portfolio active (free)
2. **Week 2**: "Templat untuk Wawancara Kerja" (job search templates)
3. **Month 3**: "Tips Riset untuk Profesional Muda"
4. **Month 6**: "Dari Karyawan ke Entrepreneur" (startup resources)
5. **Year 2**: "Alumni Success Stories" + Special return offer

#### Campaign 2: Startup Transition
**Trigger:** User updates persona from 'Mahasiswa' to 'Startup'

**Email Sequence:**
1. **Immediate**: "Selamat atas startup Anda!" + Business plan promo
2. **Week 1**: "Riset Pasar untuk Startup" templates
3. **Month 1**: "Startup Founder Toolkit" (team collaboration features)

#### Campaign 3: Dormant User Reactivation
**Trigger:** No login for 90 days + had Pro subscription

**Email Sequence:**
1. **Day 90**: "We miss you!" + What's new features
2. **Day 120**: "Your research is still here" (portfolio reminder)
3. **Day 150**: "Special comeback offer" (50% discount)

### Implementation

Create email automation service:

```typescript
// src/lib/email/automation.ts
import { LIFECYCLE_EVENTS } from '@/lib/analytics/events';

export async function triggerLifecycleEmail(
  userId: string,
  event: string,
  metadata: Record<string, any>
) {
  // Determine campaign based on event
  const campaign = getCampaignForEvent(event, metadata);
  
  if (!campaign) return;
  
  // Enqueue email in Supabase or external service
  await enqueueEmail({
    user_id: userId,
    campaign_id: campaign.id,
    scheduled_at: campaign.trigger_delay,
    metadata
  });
}

function getCampaignForEvent(event: string, metadata: any) {
  switch (event) {
    case LIFECYCLE_EVENTS.SUBSCRIPTION_CANCELLED:
      if (metadata.persona === 'Mahasiswa') {
        return CAMPAIGNS.POST_GRADUATION_NURTURE;
      }
      break;
    // ... other campaigns
  }
  return null;
}
```

### Database Schema for Emails

```sql
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(255) NOT NULL,
    trigger_conditions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    delay_days INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id),
    sequence_id UUID NOT NULL REFERENCES email_sequences(id),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_queue_scheduled_at ON email_queue(scheduled_at);
CREATE INDEX idx_email_queue_user_id ON email_queue(user_id);
CREATE INDEX idx_email_queue_status ON email_queue(status);
```

## Solution 3: Gamification & Milestones

### Concept
Create engagement touchpoints that reward progress and encourage return.

### Features

#### 1. Achievement System
```typescript
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points: number;
  trigger_condition: string;
}

// Examples:
// - "First Survey Created"
// - "100 Responses Collected"
// - "Template Expert" (used 10+ templates)
// - "Data Analyst" (exported data 5+ times)
// - "Comeback Kid" (returned after 6 months)
```

#### 2. Progress Tracking
Show users their journey:
- Surveys created
- Total responses collected
- Templates used
- Portfolio views
- Career milestone unlocks

#### 3. Alumni Network (Future)
Connect graduated students:
- Share success stories
- Mentor new students
- Collaborate on research
- Q-Persona becomes networking platform

## Metrics to Track

### Retention Metrics
- 30/60/90 day retention rates
- Subscription churn by persona
- Time to reactivation
- Portfolio engagement rate

### Lifecycle Metrics
- Persona transition rates (Budi → Andi conversion)
- Email open/click rates by campaign
- Portfolio creation rate
- Social sharing rate

### Business Impact
- Customer Lifetime Value (CLV)
- Reactivation rate
- Upgrade rate from reactivated users
- Net Promoter Score (NPS)

## Technical Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Create database schema for portfolios
- [ ] Build basic portfolio builder UI
- [ ] Implement public portfolio page
- [ ] Add lifecycle event tracking

### Phase 2: Automation (Week 3-4)
- [ ] Create email campaign database
- [ ] Build email automation service
- [ ] Integrate with email provider (SendGrid/Mailgun)
- [ ] Configure first campaign (post-graduation)

### Phase 3: Enhancement (Week 5-6)
- [ ] Add portfolio analytics dashboard
- [ ] Implement achievement system
- [ ] Build social sharing features
- [ ] Create lifecycle insights dashboard

### Phase 4: Optimization (Ongoing)
- [ ] A/B test email campaigns
- [ ] Optimize portfolio templates
- [ ] Add portfolio premium features
- [ ] Build alumni network features

## ROI Calculation

### Current State (Without Retention)
- Budi pays $10/month for 12 months = $120 LTV
- Churns after graduation
- Never returns as Andi

### Future State (With Retention)
- Budi pays $10/month for 12 months = $120
- Keeps free portfolio for 4 years
- Returns as Andi with Business plan = $600/year
- Total LTV = $120 + $2,400 = **$2,520** (21x increase)

### Investment Required
- Development: 6 weeks × $5,000/week = $30,000
- Email service: $100/month
- Hosting portfolio pages: Negligible (Vercel)
- **Total Year 1**: ~$31,200

### Break-Even
- Need 13 Budi→Andi conversions to break even
- At 1% conversion rate, need 1,300 Budi users
- Expected ROI: 400%+ in Year 2

## Next Steps

1. Validate with user interviews (5-10 recent graduates)
2. Design portfolio templates
3. Build MVP portfolio feature
4. Set up email automation infrastructure
5. Launch beta to recent graduates
6. Measure engagement and iterate
