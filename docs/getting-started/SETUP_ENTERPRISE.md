# Quick Setup Guide - Enterprise Features

This guide will help you set up and test the new enterprise features in Q-Persona.

## Prerequisites

- Q-Persona repository cloned and running
- Database access (Supabase or PostgreSQL)
- Environment variables configured

## Step 1: Database Migration

Apply the enterprise features migration:

```bash
# If using Supabase, run in the SQL Editor
# If using PostgreSQL directly:
psql -d your_database -f database/migrations/002_add_enterprise_features.sql
```

Verify tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN (
  'workspace_api_keys',
  'webhooks',
  'webhook_deliveries',
  'benchmark_scores',
  'expert_profiles'
);
```

## Step 2: Environment Variables

Add to your `.env.local`:

```bash
# Cron job security (required)
CRON_SECRET=generate-a-random-secret-here

# Should already be configured
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

Generate a secure CRON_SECRET:
```bash
openssl rand -base64 32
```

## Step 2.5: Understanding Workspace Roles and Permissions

Q-Persona uses a Role-Based Access Control (RBAC) system with three workspace roles:

**Workspace Role Codes:**
- `viewer` (Level 1): Read-only access to all resources
- `editor` (Level 2): Can create and modify questionnaires and templates
- `admin` (Level 3): Full workspace control including billing and member management

**Action Permission Codes:**

All operations in Q-Persona use standardized permission codes. Here are the key codes:

| Permission Code | Required Role | Description |
|----------------|---------------|-------------|
| `questionnaires:read` | `viewer` | View questionnaires |
| `questionnaires:create` | `editor` | Create new questionnaires |
| `questionnaires:update` | `editor` | Modify questionnaires |
| `questionnaires:delete` | `admin` | Delete questionnaires |
| `templates:read` | `viewer` | View templates |
| `templates:create` | `editor` | Create new templates |
| `templates:update` | `editor` | Modify templates |
| `templates:delete` | `admin` | Delete templates |
| `workspace:update` | `admin` | Modify workspace settings |
| `workspace:billing` | `admin` | Access billing settings |
| `workspace:members:invite` | `admin` | Invite new members |
| `workspace:members:remove` | `admin` | Remove members |
| `workspace:members:update-role` | `admin` | Change member roles |

**Example Usage in Code:**

```typescript
import { canPerformAction } from '@/lib/auth/authorization';

// Check if user can perform action
if (canPerformAction(ctx, 'questionnaires:delete')) {
  // User is admin - allow deletion
} else {
  // Return 403 Forbidden
}
```

## Step 3: Test the Features

### A. Test Public API

1. **Create an API Key** (manual for testing):

```sql
INSERT INTO workspace_api_keys (
  workspace_id,
  user_id,
  name,
  key_hash,
  key_prefix,
  scopes,
  is_active
) VALUES (
  'test-workspace',
  (SELECT id FROM users LIMIT 1),
  'Test API Key',
  'test-key-12345',  -- In production, this should be hashed
  'qp_test',
  '["read:questionnaires", "write:responses"]'::jsonb,
  true
);
```

2. **Test the API:**

```bash
# List questionnaires
curl -X GET \
  http://localhost:3000/api/v1/questionnaires \
  -H "Authorization: Bearer test-key-12345"

# Create a response
curl -X POST \
  http://localhost:3000/api/v1/responses \
  -H "Authorization: Bearer test-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire_id": "your-questionnaire-id",
    "email": "test@example.com",
    "name": "Test User",
    "answers": [
      {
        "question_id": "q1",
        "value": 5
      }
    ]
  }'
```

### B. Test Webhooks

1. **Go to webhook management:**
   - Navigate to: `http://localhost:3000/dashboard/workspace/settings/webhooks`

2. **Use a webhook testing service:**
   - Visit https://webhook.site
   - Copy your unique URL

3. **Create a webhook via UI or API:**

```bash
curl -X POST \
  http://localhost:3000/api/webhooks \
  -H "Cookie: your-session-cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "test-workspace",
    "name": "Test Webhook",
    "target_url": "https://webhook.site/your-unique-id",
    "event_types": ["response.created", "response.completed"]
  }'
```

4. **Test webhook trigger:**
   - Submit a response using the API
   - Check webhook.site to see the webhook delivery

### C. Test Benchmarking

1. **Add benchmark categories to templates:**

```sql
UPDATE templates 
SET benchmark_category = 'product_market_fit'
WHERE name LIKE '%Product%Market%Fit%';

UPDATE templates 
SET benchmark_category = 'employee_satisfaction'
WHERE name LIKE '%Employee%Satisfaction%';
```

2. **Ensure you have some responses:**
   - Create questionnaires from these templates
   - Submit at least 10+ responses per category

3. **Run the benchmark calculation:**

```bash
curl -X GET \
  http://localhost:3000/api/cron/calculate-benchmarks \
  -H "Authorization: Bearer your-cron-secret"
```

4. **Verify benchmark scores:**

```sql
SELECT 
  benchmark_category,
  score_type,
  score_value,
  sample_size,
  calculation_date
FROM benchmark_scores
ORDER BY benchmark_category, score_type;
```

5. **View benchmarks in UI:**
   - Go to any questionnaire results page
   - You should see benchmark comparison if the template has a benchmark_category

### D. Test Expert Profiles

1. **Create an expert profile:**

```sql
INSERT INTO expert_profiles (
  username,
  display_name,
  email,
  bio,
  affiliation,
  is_verified,
  total_templates,
  total_downloads,
  average_rating
) VALUES (
  'dr-sarah-johnson',
  'Dr. Sarah Johnson',
  'sarah@university.edu',
  'Associate Professor of Psychology specializing in organizational behavior',
  'Stanford University',
  true,
  5,
  1520,
  4.8
);
```

2. **Link templates to expert:**

```sql
-- First, ensure marketplace templates exist
INSERT INTO marketplace_templates (
  template_id,
  expert_profile_id,
  is_public,
  download_count,
  rating_average,
  rating_count
)
SELECT 
  t.id,
  (SELECT id FROM expert_profiles WHERE username = 'dr-sarah-johnson'),
  true,
  FLOOR(RANDOM() * 1000) + 100,
  4.0 + RANDOM(),
  FLOOR(RANDOM() * 100) + 20
FROM templates t
WHERE t.name LIKE '%Employee%'
LIMIT 3;
```

3. **View expert profile:**
   - Navigate to: `http://localhost:3000/experts/dr-sarah-johnson`
   - You should see the expert's profile with their templates

## Step 4: Access the UI Pages

- **API Keys:** http://localhost:3000/dashboard/workspace/settings/api-keys
- **Webhooks:** http://localhost:3000/dashboard/workspace/settings/webhooks
- **SSO Settings:** http://localhost:3000/dashboard/workspace/settings/sso
- **Marketplace:** http://localhost:3000/marketplace
- **Expert Submission:** http://localhost:3000/experts/submit

## Step 5: Production Deployment

### Configure Cron Job

**On Vercel:**

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/calculate-benchmarks",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**On other platforms:**

Use your platform's cron functionality or external cron service to call:
```
POST https://your-domain.com/api/cron/calculate-benchmarks
Authorization: Bearer YOUR_CRON_SECRET
```

### Security Checklist

- [ ] `CRON_SECRET` is set and not a default value
- [ ] `SUPABASE_SERVICE_KEY` is only used server-side
- [ ] API keys in production use hashed values (implement bcrypt)
- [ ] Webhook secrets are generated randomly
- [ ] Database RLS policies are enabled
- [ ] CORS is configured properly for API endpoints

## Troubleshooting

### API Returns 401 Unauthorized
- Check that API key exists in `workspace_api_keys` table
- Verify `is_active = true`
- Ensure Authorization header format is correct: `Bearer YOUR_KEY`
- Check API key has required scopes

### Webhooks Not Triggering
- Verify webhook `is_active = true`
- Check `event_types` array includes the event
- Review `webhook_deliveries` table for error logs
- Test webhook URL manually (ensure it's accessible)

### Benchmarks Not Calculating
- Verify `CRON_SECRET` is set correctly
- Check templates have `benchmark_category` set
- Ensure sufficient responses exist (minimum 10+ per category)
- Review cron job logs for errors

### Expert Profile 404
- Check `expert_profiles` table has entry with matching username
- Verify templates are linked via `marketplace_templates.expert_profile_id`
- Ensure `marketplace_templates.is_public = true`

## Testing Checklist

- [ ] Public API GET requests work
- [ ] Public API POST requests work
- [ ] API authentication blocks invalid keys
- [ ] Webhook creation works via UI
- [ ] Webhooks trigger on response submission
- [ ] Webhook delivery logs are created
- [ ] Benchmark cron job completes successfully
- [ ] Benchmark scores appear in database
- [ ] Benchmark UI shows on results page
- [ ] Expert profiles display correctly
- [ ] Marketplace shows templates with ratings

## Next Steps

1. **Customize benchmark categories** for your use case
2. **Create expert profiles** for your template contributors
3. **Document your API** for external developers
4. **Set up monitoring** for webhook deliveries
5. **Configure cron job** for production
6. **Review security** implementation before production

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review server logs
3. Verify database tables were created correctly
4. Ensure environment variables are set
5. Review the main documentation in `ENTERPRISE_FEATURES.md`

## Success Criteria

You've successfully set up the enterprise features when:

✅ You can create and use API keys
✅ You can list questionnaires via API
✅ You can submit responses via API
✅ Webhooks trigger and deliver successfully
✅ Benchmark scores calculate nightly
✅ Results pages show benchmark comparisons
✅ Expert profiles display with templates
✅ All UI pages load without errors

Congratulations! Your Q-Persona instance now has enterprise-ready features.
