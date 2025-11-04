-- 004_feature_flags_and_residency.sql
-- Introduce plan-based feature flags and data residency hint

-- Data residency hint at the subscription level (optional, can be elevated to workspace when it exists)
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS data_region VARCHAR(10) CHECK (data_region IN ('us', 'eu', 'apac'));

-- Catalog of available feature flags (admin-managed)
CREATE TABLE IF NOT EXISTS feature_flags (
  key VARCHAR(64) PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mapping of plan types to enabled features
-- Note: plan_type values should match subscriptions.plan_type enum
CREATE TABLE IF NOT EXISTS plan_feature_flags (
  plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'pro', 'business')),
  feature_key VARCHAR(64) NOT NULL REFERENCES feature_flags(key) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (plan_type, feature_key)
);

-- Seed common enterprise features
INSERT INTO feature_flags (key, description) VALUES
  ('api', 'Access to public API'),
  ('audit_logs', 'Access to audit logs UI and APIs'),
  ('sso', 'Workspace SSO (SAML/OAuth) configuration'),
  ('scim', 'SCIM 2.0 provisioning endpoints'),
  ('data_residency', 'Select and pin data processing region'),
  ('custom_roles', 'Custom roles and granular permissions')
ON CONFLICT (key) DO NOTHING;

-- Defaults by plan. Adjust as GTM evolves.
-- Free: API only
INSERT INTO plan_feature_flags (plan_type, feature_key, enabled) VALUES
  ('free', 'api', true)
ON CONFLICT DO NOTHING;

-- Pro: API + audit logs
INSERT INTO plan_feature_flags (plan_type, feature_key, enabled) VALUES
  ('pro', 'api', true),
  ('pro', 'audit_logs', true)
ON CONFLICT DO NOTHING;

-- Business: all enterprise features
INSERT INTO plan_feature_flags (plan_type, feature_key, enabled) VALUES
  ('business', 'api', true),
  ('business', 'audit_logs', true),
  ('business', 'sso', true),
  ('business', 'scim', true),
  ('business', 'data_residency', true),
  ('business', 'custom_roles', true)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_plan_feature_flags_plan_type ON plan_feature_flags(plan_type);
CREATE INDEX IF NOT EXISTS idx_plan_feature_flags_feature_key ON plan_feature_flags(feature_key);
