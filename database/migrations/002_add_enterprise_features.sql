-- Migration: Add Enterprise-Ready Features
-- Date: 2025-11-04
-- Description: Implements critical recommendations for enterprise sales, API integration, benchmarking, and marketplace mechanics

-- Recommendation #1: Enhanced templates for benchmarking
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS benchmark_category VARCHAR(100),
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Recommendation #2: Workspace API Keys for public API access
CREATE TABLE IF NOT EXISTS workspace_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    scopes JSONB DEFAULT '["read:questionnaires", "write:responses"]',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation #2: Webhooks for outbound integrations
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_url VARCHAR(1000) NOT NULL,
    event_types JSONB DEFAULT '["response.created", "response.completed"]',
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation #2: Webhook delivery logs
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT false
);

-- Recommendation #3: Benchmark scores aggregation
CREATE TABLE IF NOT EXISTS benchmark_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    benchmark_category VARCHAR(100) NOT NULL,
    score_type VARCHAR(50) NOT NULL,
    score_value DECIMAL(10,2) NOT NULL,
    sample_size INTEGER NOT NULL,
    calculation_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(benchmark_category, score_type, calculation_date)
);

-- Recommendation #4: Expert profiles
CREATE TABLE IF NOT EXISTS expert_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bio TEXT,
    affiliation VARCHAR(255),
    website_url VARCHAR(500),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    total_templates INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Link expert profiles to marketplace templates
ALTER TABLE marketplace_templates 
ADD COLUMN IF NOT EXISTS expert_profile_id UUID REFERENCES expert_profiles(id) ON DELETE SET NULL;

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_workspace_api_keys_updated_at ON workspace_api_keys;
CREATE TRIGGER update_workspace_api_keys_updated_at BEFORE UPDATE ON workspace_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expert_profiles_updated_at ON expert_profiles;
CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON expert_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspace_api_keys_user_id ON workspace_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_api_keys_workspace_id ON workspace_api_keys(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_api_keys_key_hash ON workspace_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_workspace_api_keys_active ON workspace_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_webhooks_workspace_id ON webhooks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type ON webhook_deliveries(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at ON webhook_deliveries(delivered_at);
CREATE INDEX IF NOT EXISTS idx_benchmark_scores_category ON benchmark_scores(benchmark_category);
CREATE INDEX IF NOT EXISTS idx_benchmark_scores_date ON benchmark_scores(calculation_date);
CREATE INDEX IF NOT EXISTS idx_benchmark_scores_category_date ON benchmark_scores(benchmark_category, calculation_date);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_username ON expert_profiles(username);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_user_id ON expert_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_verified ON expert_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_templates_benchmark_category ON templates(benchmark_category);
CREATE INDEX IF NOT EXISTS idx_templates_usage_count ON templates(usage_count);
