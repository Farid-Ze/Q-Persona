-- Q-Persona Database Schema
-- PostgreSQL schema for lean service-based architecture
-- Flow: Users → Persona → Templates → Questionnaire → Respondents → Answers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Persona table (predefined personas like 'Mahasiswa', 'Startup', etc.)
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    attributes JSONB DEFAULT '{}',
    is_system BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-Persona junction table (many-to-many relationship)
CREATE TABLE user_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, persona_id)
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questionnaires table
CREATE TABLE questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Respondents table
CREATE TABLE respondents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    email VARCHAR(255),
    name VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Answers table
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
    question_id UUID NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table for Stripe integration
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
    plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    -- Quota limits per plan (Recommendation #2)
    max_questionnaires INTEGER DEFAULT 5,
    max_responses_per_month INTEGER DEFAULT 100,
    max_api_calls_per_minute INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table for tracking user behavior
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(255) NOT NULL,
    event_properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Response queue table (for async processing)
CREATE TABLE response_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX idx_user_personas_user_id ON user_personas(user_id);
CREATE INDEX idx_user_personas_persona_id ON user_personas(persona_id);
CREATE INDEX idx_templates_persona_id ON templates(persona_id);
CREATE INDEX idx_questionnaires_template_id ON questionnaires(template_id);
CREATE INDEX idx_questionnaires_status ON questionnaires(status);
CREATE INDEX idx_respondents_questionnaire_id ON respondents(questionnaire_id);
CREATE INDEX idx_answers_respondent_id ON answers(respondent_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_failed_jobs_status ON failed_jobs(status);
CREATE INDEX idx_failed_jobs_failed_at ON failed_jobs(failed_at);
CREATE INDEX idx_audit_logs_workspace_id ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_expert_submissions_status ON expert_submissions(status);
CREATE INDEX idx_expert_submissions_expert_email ON expert_submissions(expert_email);
CREATE INDEX idx_response_queue_status ON response_queue(status);
CREATE INDEX idx_response_queue_created_at ON response_queue(created_at);

-- MFA (Multi-Factor Authentication) table
CREATE TABLE user_mfa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255), -- TOTP secret
    backup_codes JSONB DEFAULT '[]', -- Array of hashed backup codes
    phone_number VARCHAR(20), -- For SMS verification
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SSO (Single Sign-On) configuration table
CREATE TABLE sso_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID, -- NULL for user-level SSO
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('saml', 'google', 'microsoft', 'github')),
    name VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    -- SAML configuration
    saml_entry_point VARCHAR(500),
    saml_issuer VARCHAR(500),
    saml_cert TEXT,
    -- OAuth configuration
    oauth_client_id VARCHAR(255),
    oauth_client_secret VARCHAR(255),
    oauth_redirect_uri VARCHAR(500),
    -- Additional settings
    auto_provision BOOLEAN DEFAULT true, -- JIT provisioning
    default_role VARCHAR(50) DEFAULT 'viewer',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Template marketplace table (extends templates)
CREATE TABLE marketplace_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE UNIQUE,
    expert_id UUID, -- Link to expert who created it
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false, -- Expert-verified badge
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    preview_image_url VARCHAR(500),
    download_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    price_cents INTEGER DEFAULT 0, -- 0 for free templates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Template ratings and reviews
CREATE TABLE template_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marketplace_template_id UUID NOT NULL REFERENCES marketplace_templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_download BOOLEAN DEFAULT false, -- User actually downloaded it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(marketplace_template_id, user_id)
);

-- CDN asset tracking
CREATE TABLE cdn_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_key VARCHAR(500) NOT NULL UNIQUE, -- S3/CDN key
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('image', 'video', 'document', 'template_export')),
    file_size BIGINT, -- bytes
    mime_type VARCHAR(100),
    cdn_url VARCHAR(1000),
    original_url VARCHAR(1000),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    workspace_id UUID, -- Optional workspace association
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON questionnaires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_submissions_updated_at BEFORE UPDATE ON expert_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mfa_updated_at BEFORE UPDATE ON user_mfa
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sso_connections_updated_at BEFORE UPDATE ON sso_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_templates_updated_at BEFORE UPDATE ON marketplace_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_reviews_updated_at BEFORE UPDATE ON template_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Additional indexes for new tables
CREATE INDEX idx_user_mfa_user_id ON user_mfa(user_id);
CREATE INDEX idx_user_mfa_enabled ON user_mfa(mfa_enabled);
CREATE INDEX idx_sso_connections_workspace_id ON sso_connections(workspace_id);
CREATE INDEX idx_sso_connections_provider ON sso_connections(provider);
CREATE INDEX idx_sso_connections_enabled ON sso_connections(enabled);
CREATE INDEX idx_marketplace_templates_template_id ON marketplace_templates(template_id);
CREATE INDEX idx_marketplace_templates_public ON marketplace_templates(is_public);
CREATE INDEX idx_marketplace_templates_featured ON marketplace_templates(is_featured);
CREATE INDEX idx_marketplace_templates_category ON marketplace_templates(category);
CREATE INDEX idx_template_reviews_template_id ON template_reviews(marketplace_template_id);
CREATE INDEX idx_template_reviews_user_id ON template_reviews(user_id);
CREATE INDEX idx_template_reviews_rating ON template_reviews(rating);
CREATE INDEX idx_cdn_assets_key ON cdn_assets(asset_key);
CREATE INDEX idx_cdn_assets_type ON cdn_assets(asset_type);
CREATE INDEX idx_cdn_assets_workspace_id ON cdn_assets(workspace_id);

-- Insert default system personas for persona-based onboarding
INSERT INTO personas (name, description, attributes, is_system) VALUES
('Mahasiswa', 'Mahasiswa atau pelajar yang membutuhkan tools untuk tugas akademis', '{"target": "students", "features": ["basic_forms", "simple_analytics"]}', true),
('Startup', 'Startup atau tim kecil yang butuh validasi produk dan riset pasar', '{"target": "startups", "features": ["advanced_forms", "team_collaboration", "data_export"]}', true),
('Peneliti', 'Akademisi dan peneliti yang melakukan riset dan survei', '{"target": "researchers", "features": ["complex_forms", "advanced_analytics", "data_export"]}', true),
('Bisnis', 'Perusahaan yang memerlukan solusi survey enterprise', '{"target": "enterprise", "features": ["all_features", "priority_support", "custom_branding"]}', true);
