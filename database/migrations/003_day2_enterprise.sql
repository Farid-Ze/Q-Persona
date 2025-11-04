-- Migration: Day 2 Enterprise Hardening
-- Date: 2025-11-04
-- Adds SCIM tokens, API request logs, and usage_count to API keys

-- SCIM tokens for enterprise provisioning auth
CREATE TABLE IF NOT EXISTS scim_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL, -- keep unconstrained for now; tie to workspaces if available
    name VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scim_tokens_workspace_id ON scim_tokens(workspace_id);
CREATE INDEX IF NOT EXISTS idx_scim_tokens_token_hash ON scim_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_scim_tokens_active ON scim_tokens(is_active);

DROP TRIGGER IF EXISTS update_scim_tokens_updated_at ON scim_tokens;
CREATE TRIGGER update_scim_tokens_updated_at BEFORE UPDATE ON scim_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- API request logs for DX observability
CREATE TABLE IF NOT EXISTS api_request_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID, -- references workspace_api_keys(id) when available
    workspace_id UUID,
    path TEXT NOT NULL,
    method VARCHAR(10) NOT NULL,
    status INTEGER,
    latency_ms INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}' -- optional extra data (query params, sample body digest, etc.)
);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_api_key_id ON api_request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_workspace_id ON api_request_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_created_at ON api_request_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_status ON api_request_logs(status);

-- Enrich API keys with usage counter (complements last_used_at)
ALTER TABLE workspace_api_keys
    ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;
