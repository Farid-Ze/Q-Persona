# Database Migration Guide

This guide explains how to apply the new database schema changes to add observability, rate limiting, audit logs, and expert portal features.

## Prerequisites

- PostgreSQL database access
- Supabase project (or direct PostgreSQL connection)
- Admin/superuser privileges

## Migration Steps

### Step 1: Backup Your Database

**IMPORTANT**: Always backup before running migrations!

```bash
# For PostgreSQL
pg_dump -U your_username -d your_database > backup_$(date +%Y%m%d).sql

# For Supabase (via CLI)
supabase db dump -f backup_$(date +%Y%m%d).sql
```

### Step 2: Add New Tables

Run these SQL statements to create the new tables:

```sql
-- Failed jobs table for observability (Recommendation #1)
CREATE TABLE failed_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_name VARCHAR(255) NOT NULL DEFAULT 'response_queue',
    payload JSONB NOT NULL,
    error_message TEXT,
    error_stack TEXT,
    failed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    status VARCHAR(50) DEFAULT 'failed' CHECK (status IN ('failed', 'retrying', 'resolved')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Audit logs table for compliance (Recommendation #3)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expert submissions table for contributor portal (Recommendation #4)
CREATE TABLE expert_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expert_id UUID,
    expert_email VARCHAR(255) NOT NULL,
    expert_name VARCHAR(255) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    template_description TEXT,
    template_questions JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Response queue table (if not already exists)
CREATE TABLE IF NOT EXISTS response_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);
```

### Step 3: Add Indexes

```sql
-- Indexes for failed_jobs
CREATE INDEX idx_failed_jobs_status ON failed_jobs(status);
CREATE INDEX idx_failed_jobs_failed_at ON failed_jobs(failed_at);

-- Indexes for audit_logs
CREATE INDEX idx_audit_logs_workspace_id ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Indexes for expert_submissions
CREATE INDEX idx_expert_submissions_status ON expert_submissions(status);
CREATE INDEX idx_expert_submissions_expert_email ON expert_submissions(expert_email);

-- Indexes for response_queue
CREATE INDEX idx_response_queue_status ON response_queue(status);
CREATE INDEX idx_response_queue_created_at ON response_queue(created_at);
```

### Step 4: Add Quota Columns to Subscriptions

```sql
-- Add quota limits to subscriptions table (Recommendation #2)
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS max_questionnaires INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_responses_per_month INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_api_calls_per_minute INTEGER DEFAULT 100;
```

### Step 5: Add Triggers

```sql
-- Trigger for expert_submissions updated_at
CREATE TRIGGER update_expert_submissions_updated_at 
BEFORE UPDATE ON expert_submissions
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

### Step 6: Update Existing Subscriptions (Optional)

Set quota limits for existing subscriptions based on their plan type:

```sql
-- Update free plan quotas
UPDATE subscriptions 
SET 
    max_questionnaires = 5,
    max_responses_per_month = 100,
    max_api_calls_per_minute = 100
WHERE plan_type = 'free';

-- Update pro plan quotas
UPDATE subscriptions 
SET 
    max_questionnaires = 50,
    max_responses_per_month = 5000,
    max_api_calls_per_minute = 1000
WHERE plan_type = 'pro';

-- Update business plan quotas
UPDATE subscriptions 
SET 
    max_questionnaires = -1, -- unlimited
    max_responses_per_month = 50000,
    max_api_calls_per_minute = 5000
WHERE plan_type = 'business';
```

## Verification

After running the migration, verify the changes:

```sql
-- Check new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('failed_jobs', 'audit_logs', 'expert_submissions', 'response_queue');

-- Check subscriptions columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND column_name IN ('max_questionnaires', 'max_responses_per_month', 'max_api_calls_per_minute');

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('failed_jobs', 'audit_logs', 'expert_submissions', 'response_queue');
```

## Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
-- Drop new tables
DROP TABLE IF EXISTS failed_jobs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS expert_submissions CASCADE;
DROP TABLE IF EXISTS response_queue CASCADE;

-- Remove columns from subscriptions
ALTER TABLE subscriptions 
DROP COLUMN IF EXISTS max_questionnaires,
DROP COLUMN IF EXISTS max_responses_per_month,
DROP COLUMN IF EXISTS max_api_calls_per_minute;

-- Restore from backup
-- psql -U your_username -d your_database < backup_YYYYMMDD.sql
```

## Supabase-Specific Instructions

If using Supabase, you can apply migrations via the dashboard or CLI:

### Via Supabase Dashboard:

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the SQL statements from steps 2-5
4. Click "Run"

### Via Supabase CLI:

1. Create a new migration file:
   ```bash
   supabase migration new add_observability_features
   ```

2. Edit the generated file and add all SQL from steps 2-5

3. Apply the migration:
   ```bash
   supabase db push
   ```

## Post-Migration Steps

1. **Test the new features:**
   - Visit `/admin/health` to check the failed jobs dashboard
   - Visit `/admin/expert-submissions` to see the approval queue
   - Visit `/experts/submit` to test expert submissions
   - Visit `/dashboard/workspace/settings/audit` to check audit logs

2. **Update environment variables** (if needed):
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set
   - Ensure `SUPABASE_SERVICE_KEY` is set

3. **Enable RLS policies** (if using Supabase):
   ```sql
   -- Example RLS for audit_logs (only workspace members can view)
   ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view their workspace audit logs" 
   ON audit_logs FOR SELECT 
   USING (workspace_id IN (
       SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
   ));
   
   -- Example RLS for failed_jobs (admin only)
   ALTER TABLE failed_jobs ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Only admins can view failed jobs" 
   ON failed_jobs FOR SELECT 
   USING (auth.jwt() ->> 'role' = 'admin');
   ```

## Troubleshooting

**Issue**: "relation does not exist"
- **Solution**: Make sure you're connected to the correct database and have the right permissions

**Issue**: "column already exists"
- **Solution**: The column might have been added already. Use `ADD COLUMN IF NOT EXISTS`

**Issue**: "function update_updated_at_column() does not exist"
- **Solution**: Run the complete schema.sql to create the function first

**Issue**: Foreign key constraint fails
- **Solution**: Ensure the referenced tables (users, workspaces) exist

## Support

For issues with migration:
1. Check the error messages carefully
2. Review the backup before rollback
3. Test on a staging environment first
4. Consult PostgreSQL/Supabase documentation

## Next Steps

After successful migration:
- Review the OBSERVABILITY.md documentation
- Configure rate limits for your use case
- Set up monitoring for failed jobs
- Train admin users on the new dashboards
