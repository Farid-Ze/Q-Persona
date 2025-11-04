-- Migration: Add Multi-Tenancy Support
-- This migration adds workspace-based multi-tenancy to support team collaboration
-- Required for Business plan ($50/month per seat)

-- ============================================================================
-- STEP 1: Create Workspaces Table
-- ============================================================================
-- A workspace represents a team or organization account
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ============================================================================
-- STEP 2: Create Workspace Members Table (with RBAC)
-- ============================================================================
-- Junction table for many-to-many relationship between users and workspaces
-- Includes role-based access control (admin, editor, viewer)
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_role ON workspace_members(role);

-- ============================================================================
-- STEP 3: Add workspace_id to existing tables
-- ============================================================================

-- Add workspace_id to questionnaires
ALTER TABLE questionnaires 
    ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

CREATE INDEX idx_questionnaires_workspace_id ON questionnaires(workspace_id);

-- Add workspace_id to templates (optional: can be workspace-specific or global)
ALTER TABLE templates 
    ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    ADD COLUMN is_global BOOLEAN DEFAULT false;

CREATE INDEX idx_templates_workspace_id ON templates(workspace_id);
CREATE INDEX idx_templates_is_global ON templates(is_global);

-- Move subscriptions from user-level to workspace-level
ALTER TABLE subscriptions 
    ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

CREATE INDEX idx_subscriptions_workspace_id ON subscriptions(workspace_id);

-- ============================================================================
-- STEP 4: Create Experts Table (Issue #2)
-- ============================================================================
-- Store expert information for template validation
CREATE TABLE experts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    affiliation VARCHAR(255),
    bio TEXT,
    photo_url TEXT,
    credentials JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add expert validation to templates
ALTER TABLE templates 
    ADD COLUMN validated_by_expert_id UUID REFERENCES experts(id) ON DELETE SET NULL,
    ADD COLUMN validation_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_templates_validated_by_expert_id ON templates(validated_by_expert_id);

-- ============================================================================
-- STEP 5: Add Triggers
-- ============================================================================

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON workspace_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON experts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Data Migration Function
-- ============================================================================
-- Function to create default workspace for existing users
-- This should be called as part of the migration process

CREATE OR REPLACE FUNCTION migrate_users_to_workspaces()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    new_workspace_id UUID;
BEGIN
    -- For each existing user, create a personal workspace
    FOR user_record IN SELECT id, email, name FROM users LOOP
        -- Create workspace
        INSERT INTO workspaces (name, slug, owner_id, plan_type)
        VALUES (
            user_record.name || '''s Workspace',
            LOWER(REPLACE(user_record.email, '@', '-at-')) || '-' || LEFT(user_record.id::text, 8),
            user_record.id,
            'free'
        )
        RETURNING id INTO new_workspace_id;
        
        -- Add user as admin of their workspace
        INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
        VALUES (new_workspace_id, user_record.id, 'admin', CURRENT_TIMESTAMP);
        
        -- Update existing questionnaires to belong to this workspace
        UPDATE questionnaires 
        SET workspace_id = new_workspace_id
        WHERE template_id IN (
            SELECT id FROM templates WHERE persona_id IN (
                SELECT persona_id FROM user_personas WHERE user_id = user_record.id
            )
        );
        
        -- Update existing subscriptions to belong to this workspace
        UPDATE subscriptions 
        SET workspace_id = new_workspace_id
        WHERE user_id = user_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute migration (comment out after first run)
-- SELECT migrate_users_to_workspaces();

-- ============================================================================
-- STEP 7: Comments for Documentation
-- ============================================================================

COMMENT ON TABLE workspaces IS 'Team/organization accounts for multi-tenancy support';
COMMENT ON TABLE workspace_members IS 'Junction table with RBAC for workspace membership';
COMMENT ON TABLE experts IS 'Expert profiles for template validation (Issue #2)';
COMMENT ON COLUMN workspace_members.role IS 'Role-based access: admin (full control), editor (edit content), viewer (read-only)';
COMMENT ON COLUMN templates.workspace_id IS 'NULL for global templates, workspace_id for workspace-specific templates';
COMMENT ON COLUMN templates.validated_by_expert_id IS 'Expert who validated this template';
