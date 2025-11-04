# IP Protection & Expert Validation

This document describes the implementation of IP (Intellectual Property) protection features and expert validation system, addressing Issues #2 and #7 from the problem statement.

## Problem Statement

### Issue #2: Expert Validation as Technical Feature
Previously, "expert validation" was just a marketing claim on the landing page. Competitors could easily copy templates and make the same claim. We needed to make validation a verifiable technical feature with proof.

### Issue #7: IP Protection
The core business asset (expert-validated templates) was exposed and easy to steal. Free users could copy all questions from templates into Google Forms and cancel their subscription.

## Solutions Implemented

## 1. Expert Validation System

### Database Schema

Created `experts` table to store verified expert profiles:

```sql
CREATE TABLE experts (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),              -- e.g., "Ph.D. in Psychology"
    affiliation VARCHAR(255),         -- e.g., "Stanford University"
    bio TEXT,
    photo_url TEXT,
    credentials JSONB DEFAULT '{}',   -- Flexible storage for achievements
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

Extended `templates` table with validation tracking:

```sql
ALTER TABLE templates 
    ADD COLUMN validated_by_expert_id UUID REFERENCES experts(id),
    ADD COLUMN validation_date TIMESTAMP WITH TIME ZONE;
```

### UI Components

#### ExpertTrustBadge Component
Location: `src/components/experts/ExpertTrustBadge.tsx`

Features:
- Displays green badge: "Divalidasi oleh Ahli" (Validated by Expert)
- Clickable to show expert details modal
- Shows expert photo, credentials, affiliation
- Displays validation date
- Converts marketing claim into verifiable product feature

Usage:
```tsx
{template.validated_by_expert_id && (
  <ExpertTrustBadge 
    expert={expert}
    validationDate={template.validation_date}
    size="md"
  />
)}
```

### Benefits
- **Defensible Moat**: Competitors can't easily replicate verified expert relationships
- **Trust Building**: Users can verify expert credentials
- **Marketing Proof**: Real experts, not just claims
- **Premium Justification**: Validates higher pricing for Business plan

## 2. IP Protection Features

### Template Fragmentation (Paywall)

Location: `src/lib/template-protection.ts`

Implementation:
```typescript
export function limitTemplateQuestions(
  questions: Question[],
  userPlan: 'free' | 'pro' | 'business',
  isPreviewMode: boolean
)
```

Strategy:
- Free users see only first 5 questions in preview mode
- Remaining questions hidden behind paywall
- Pro/Business users see complete templates

### Copy Protection

#### CSS Protection
```typescript
export const COPY_PROTECTION_STYLES = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
};
```

#### JavaScript Protection
```typescript
export const COPY_PROTECTION_HANDLERS = {
  onCopy: (e) => e.preventDefault(),
  onCut: (e) => e.preventDefault(),
  onContextMenu: (e) => e.preventDefault(),
  onDragStart: (e) => e.preventDefault(),
};
```

Apply to template preview components:
```tsx
<div 
  style={COPY_PROTECTION_STYLES}
  {...COPY_PROTECTION_HANDLERS}
>
  {/* Template content */}
</div>
```

### Paywall Component

Location: `src/components/templates/TemplatePaywall.tsx`

Displays when free users reach question limit:
- Shows number of locked questions
- Upgrade CTA to Pro plan
- Lists Pro plan benefits
- Creates technical friction to prevent IP theft

### Watermarking

For public questionnaires (free/pro plans):
```typescript
export function getWatermarkConfig(
  userPlan: 'free' | 'pro' | 'business',
  isPublic: boolean
)
```

Returns watermark configuration:
- Free/Pro: "Dibuat dengan Q-Persona" watermark
- Business: No watermark (custom branding)
- Only on public questionnaires

## Implementation Guidelines

### For Template Preview Pages

```tsx
import { limitTemplateQuestions, COPY_PROTECTION_STYLES, COPY_PROTECTION_HANDLERS } from '@/lib/template-protection';
import { TemplatePaywall } from '@/components/templates/TemplatePaywall';
import { ExpertTrustBadge } from '@/components/experts/ExpertTrustBadge';

// In component
const { questions, isLimited, remainingCount } = limitTemplateQuestions(
  template.questions,
  userPlan,
  true // isPreviewMode
);

return (
  <div 
    style={COPY_PROTECTION_STYLES}
    {...COPY_PROTECTION_HANDLERS}
  >
    {/* Show expert badge if validated */}
    {template.validated_by_expert_id && (
      <ExpertTrustBadge 
        expert={expert}
        validationDate={template.validation_date}
      />
    )}
    
    {/* Show available questions */}
    {questions.map(q => <Question key={q.id} {...q} />)}
    
    {/* Show paywall if limited */}
    {isLimited && (
      <TemplatePaywall 
        remainingQuestions={remainingCount}
        templateName={template.name}
      />
    )}
  </div>
);
```

### For Public Questionnaires

```tsx
import { getWatermarkConfig } from '@/lib/template-protection';

const watermark = getWatermarkConfig(workspace.plan_type, true);

{watermark.enabled && (
  <div className="fixed bottom-4 right-4 text-sm text-gray-500">
    {watermark.text}
  </div>
)}
```

## Security Levels

### Level 1: UI Protection (Implemented)
- CSS user-select: none
- JavaScript event prevention
- Deters 99% of casual users
- Easy to bypass for developers

### Level 2: API Protection (Recommended Next Step)
- Server-side question limiting
- API returns only allowed questions based on plan
- Prevents API inspection
- More secure but requires backend changes

### Level 3: Obfuscation (Optional)
- Encode question IDs
- Randomize question order in API
- Time-limited preview tokens
- For high-value templates only

## Analytics & Monitoring

Track IP protection effectiveness:

```typescript
// Event tracking
trackEvent('template_paywall_shown', {
  template_id,
  user_plan,
  remaining_questions,
});

trackEvent('template_copy_prevented', {
  template_id,
  protection_type: 'right_click' | 'keyboard' | 'drag',
});
```

Monitor metrics:
- Paywall conversion rate
- Copy prevention triggers
- Upgrade attribution from paywall
- Template preview completion rate

## Expert Management

### Adding Experts (Admin Function)

```sql
INSERT INTO experts (name, title, affiliation, bio, photo_url, credentials)
VALUES (
  'Dr. Jane Smith',
  'Ph.D. in Organizational Psychology',
  'MIT Sloan School of Management',
  'Dr. Smith has 15 years experience in survey methodology...',
  'https://example.com/photo.jpg',
  '{"publications": 25, "citations": 500, "h_index": 12}'
);
```

### Validating Templates

```sql
UPDATE templates 
SET 
  validated_by_expert_id = 'expert-uuid',
  validation_date = NOW()
WHERE id = 'template-uuid';
```

## Business Impact

### Conversion Funnel
1. User discovers template (free preview)
2. Sees expert validation badge → builds trust
3. Tries to view all questions → hits paywall
4. Converts to Pro to unlock questions
5. Becomes retained customer

### Metrics to Track
- Template preview → Pro conversion rate
- Expert badge click-through rate
- Paywall → upgrade rate
- IP theft attempts (copy events)

## Legal Considerations

- Copy protection is technical friction, not legal protection
- Include Terms of Service prohibiting content scraping
- Expert validation agreements should include IP rights
- Consider copyright registration for template collections

## Future Enhancements

1. **Expert Marketplace**: Let experts submit templates
2. **Validation Levels**: Bronze/Silver/Gold validation tiers
3. **Expert Profiles**: Public pages for experts
4. **Blockchain Verification**: Immutable validation records
5. **API Rate Limiting**: Prevent bulk template extraction
6. **Dynamic Watermarking**: Include user info in watermark

## Testing Checklist

- [ ] Expert badge displays correctly
- [ ] Modal shows expert details
- [ ] Free users see only 5 questions
- [ ] Paywall appears after limit
- [ ] Copy protection prevents right-click
- [ ] Copy protection prevents Ctrl+C
- [ ] Copy protection prevents drag-select
- [ ] Watermark shows on public questionnaires
- [ ] Pro users see full templates
- [ ] Business users see no watermark
