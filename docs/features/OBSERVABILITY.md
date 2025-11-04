# Observability and Monitoring Features

This document describes the observability, monitoring, and admin features added to Q-Persona.

## Overview

Four critical improvements have been implemented to address production readiness concerns:

1. **Failed Job Monitoring** - Observability for async queue processing
2. **Rate Limiting & Quotas** - Cost control and abuse prevention
3. **Audit Logging** - Compliance and security tracking
4. **Expert Contributor Portal** - Scalable content creation

---

## 1. Failed Job Monitoring (Admin Health Dashboard)

### Problem Addressed
When the async response queue fails to process jobs, there was no visibility into what failed or ability to recover.

### Solution
- **Failed Jobs Table**: All processing failures are logged to `failed_jobs` table
- **Admin Dashboard**: View failed jobs at `/admin/health`
- **Retry Mechanism**: One-click retry via `/api/admin/retry-job`

### Usage

**Access the dashboard:**
```
https://your-domain.com/admin/health
```

**View failed jobs:**
- Lists all failed queue items
- Shows error messages and stack traces
- Displays payload for debugging
- Provides retry button for each failed job

**Retry a failed job:**
Click the "Retry" button next to any failed job. The system will:
1. Re-queue the job in `response_queue`
2. Mark the failed job as 'resolved'
3. Process it in the next cron run

### Database Schema

```sql
CREATE TABLE failed_jobs (
    id UUID PRIMARY KEY,
    queue_name VARCHAR(255),
    payload JSONB NOT NULL,
    error_message TEXT,
    error_stack TEXT,
    failed_at TIMESTAMP,
    retry_count INTEGER,
    status VARCHAR(50) -- 'failed', 'retrying', 'resolved'
);
```

---

## 2. Rate Limiting & Quotas

### Problem Addressed
Without limits, free-tier users could abuse the API and cause unexpected costs.

### Solution

**Rate Limiting:**
- In-memory rate limiting library at `src/lib/rate-limit/`
- Different limits per plan:
  - Free: 100 requests/minute
  - Pro: 1,000 requests/minute
  - Business: 5,000 requests/minute

**Quota Enforcement:**
- Quotas stored in `subscriptions` table
- Check before processing responses
- Limits on:
  - Questionnaires per workspace
  - Responses per month
  - API calls per minute

### Usage

**Check rate limit in API route:**
```typescript
import { rateLimitMiddleware } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const workspaceId = 'workspace-123';
  const planType = 'free'; // or 'pro', 'business'
  
  const rateLimitResult = rateLimitMiddleware(workspaceId, planType);
  if (rateLimitResult) {
    return rateLimitResult; // 429 Too Many Requests
  }
  
  // Continue with request...
}
```

**Check quota:**
```typescript
import { checkResponseQuota } from '@/lib/quota';

const quota = await checkResponseQuota(workspaceId, questionnaireId);
if (!quota.allowed) {
  return NextResponse.json(
    { error: quota.message },
    { status: 403 }
  );
}
```

### Database Schema

```sql
ALTER TABLE subscriptions ADD COLUMN max_questionnaires INTEGER DEFAULT 5;
ALTER TABLE subscriptions ADD COLUMN max_responses_per_month INTEGER DEFAULT 100;
ALTER TABLE subscriptions ADD COLUMN max_api_calls_per_minute INTEGER DEFAULT 100;
```

---

## 3. Audit Logging

### Problem Addressed
Enterprise customers require audit trails for compliance (GDPR, HIPAA, etc.).

### Solution
- **Audit Logs Table**: All sensitive actions logged
- **Audit Viewer**: View logs at `/dashboard/workspace/settings/audit`
- **Audit Library**: Helper functions in `src/lib/audit/`

### Usage

**Log an action:**
```typescript
import { logAudit, AUDIT_ACTIONS } from '@/lib/audit';

await logAudit({
  workspaceId: 'workspace-123',
  userId: 'user-456',
  action: AUDIT_ACTIONS.QUESTIONNAIRE_DELETED,
  resourceType: 'questionnaire',
  resourceId: 'quest-789',
  metadata: { name: 'Customer Survey' },
  request: request, // Optional, captures IP and user-agent
});
```

**View audit logs:**
```
https://your-domain.com/dashboard/workspace/settings/audit
```

Shows:
- Timestamp of action
- User who performed action
- Action type (created, updated, deleted, etc.)
- Resource affected
- IP address and user agent
- Additional metadata

### Common Actions

```typescript
AUDIT_ACTIONS = {
  QUESTIONNAIRE_CREATED: 'questionnaire.created',
  QUESTIONNAIRE_DELETED: 'questionnaire.deleted',
  MEMBER_INVITED: 'member.invited',
  MEMBER_REMOVED: 'member.removed',
  WORKSPACE_SETTINGS_CHANGED: 'workspace.settings_changed',
  BILLING_PLAN_CHANGED: 'billing.plan_changed',
  // ... and more
}
```

### Database Schema

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    workspace_id UUID,
    user_id UUID,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP
);
```

---

## 4. Expert Contributor Portal

### Problem Addressed
Template creation was a bottleneck - only internal team could add templates.

### Solution
- **Expert Portal**: Public submission form at `/experts/submit`
- **Admin Review**: Approval queue at `/admin/expert-submissions`
- **Submission Tracking**: Store in `expert_submissions` table

### Usage

**For Experts - Submit a template:**
1. Visit `https://your-domain.com/experts/submit`
2. Fill in:
   - Name and email
   - Template name and description
   - Questions in JSON format
3. Submit for review

**For Admins - Review submissions:**
1. Visit `https://your-domain.com/admin/expert-submissions`
2. Review each submission:
   - View template details
   - Check question quality
   - Approve or reject
3. Approved templates can be converted to official templates

### Database Schema

```sql
CREATE TABLE expert_submissions (
    id UUID PRIMARY KEY,
    expert_email VARCHAR(255) NOT NULL,
    expert_name VARCHAR(255) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    template_description TEXT,
    template_questions JSONB NOT NULL,
    status VARCHAR(50), -- 'pending', 'approved', 'rejected'
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP
);
```

---

## Integration with Existing Features

### Process Responses Cron
The cron job at `/api/cron/process-responses` now:
- Logs failures to `failed_jobs` table
- Checks quotas before processing
- Can be monitored via admin dashboard

### Submit Endpoint
The `/api/submit` endpoint:
- Has hooks for rate limiting (commented for edge runtime)
- Validates against quotas in background processing
- Logs to response queue for async handling

---

## Future Enhancements

1. **Rate Limiting**: Integrate Upstash Redis for distributed rate limiting in edge runtime
2. **Super Admin RBAC**: Add role checking for admin pages
3. **Email Notifications**: Alert on quota exceeded, expert submissions, failed jobs
4. **Revenue Sharing**: Implement payment model for expert contributors
5. **Advanced Metrics**: Dashboard for queue health, processing times, quota usage
6. **Audit Export**: Export audit logs for compliance reporting

---

## Security Considerations

- Admin pages should check for Super Admin role (TODO)
- Rate limiting prevents API abuse
- Audit logs track all sensitive operations
- Failed job payloads may contain sensitive data - restrict access
- Expert submissions are in pending state until admin review

---

## Monitoring Checklist

Daily:
- [ ] Check `/admin/health` for failed jobs
- [ ] Review new expert submissions at `/admin/expert-submissions`

Weekly:
- [ ] Review audit logs for unusual activity
- [ ] Check quota usage across workspaces

Monthly:
- [ ] Analyze failed job patterns
- [ ] Review rate limit effectiveness
- [ ] Clean up old audit logs (if needed)
