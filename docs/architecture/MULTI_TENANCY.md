# Multi-Tenancy & RBAC Implementation

This document describes the multi-tenancy architecture and Role-Based Access Control (RBAC) implementation for Q-Persona, addressing critical Issues #1 and #5 from the problem statement.

## Overview

The previous architecture was single-user based, where each resource (questionnaires, templates, subscriptions) belonged to a single `user_id`. This prevented team collaboration features required for the Business plan.

The new architecture introduces **workspaces** as the primary organizational unit, enabling true multi-tenancy where resources belong to workspaces, and users can be members of multiple workspaces with different roles.

## Database Schema Changes

### New Tables

#### 1. `workspaces` Table
Represents a team or organization account.

```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    plan_type VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

#### 2. `workspace_members` Table
Junction table with Role-Based Access Control (RBAC).

```sql
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    -- role: 'admin', 'editor', or 'viewer'
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(workspace_id, user_id)
);
```

#### 3. `experts` Table
Stores expert profiles for template validation (Issue #2).

```sql
CREATE TABLE experts (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    affiliation VARCHAR(255),
    bio TEXT,
    photo_url TEXT,
    credentials JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Modified Tables

All resource tables now include `workspace_id`:
- `questionnaires.workspace_id`
- `templates.workspace_id` (with `is_global` flag for system templates)
- `subscriptions.workspace_id` (moved from user-level to workspace-level)

Templates also include expert validation fields:
- `templates.validated_by_expert_id`
- `templates.validation_date`

## Role-Based Access Control (RBAC)

### Role Hierarchy

1. **Admin** (highest privileges)
   - Full control over workspace
   - Can manage members, billing, and all resources
   - Can delete any resource
   
2. **Editor** (content management)
   - Can create, read, and update questionnaires/templates
   - Cannot delete resources or manage workspace settings
   
3. **Viewer** (read-only)
   - Can only view resources
   - Cannot modify anything

### Workspace Role Codes

The platform uses three standardized role codes:

| Role Code | Level | Description | Typical Use Cases |
|-----------|-------|-------------|-------------------|
| `viewer` | 1 | Read-only access | Stakeholders, clients, external collaborators |
| `editor` | 2 | Can create and edit content | Content creators, researchers, analysts |
| `admin` | 3 | Full workspace control | Workspace owners, team leads, managers |

**Role Capabilities Matrix:**

| Action | Viewer | Editor | Admin |
|--------|--------|--------|-------|
| View questionnaires | ✅ | ✅ | ✅ |
| View templates | ✅ | ✅ | ✅ |
| Create questionnaires | ❌ | ✅ | ✅ |
| Create templates | ❌ | ✅ | ✅ |
| Update questionnaires | ❌ | ✅ | ✅ |
| Update templates | ❌ | ✅ | ✅ |
| Delete questionnaires | ❌ | ❌ | ✅ |
| Delete templates | ❌ | ❌ | ✅ |
| Update workspace settings | ❌ | ❌ | ✅ |
| Manage billing | ❌ | ❌ | ✅ |
| Invite members | ❌ | ❌ | ✅ |
| Remove members | ❌ | ❌ | ✅ |
| Change member roles | ❌ | ❌ | ✅ |

### Permission Model

The authorization system uses a hierarchical permission model:

```typescript
const roleHierarchy = {
  viewer: 1,
  editor: 2,
  admin: 3,
};
```

Actions require minimum role levels:
- Read operations: `viewer`
- Create/Update operations: `editor`
- Delete operations: `admin`
- Workspace management: `admin`

### Action Permission Codes

The platform uses standardized action permission codes for fine-grained access control. These codes are defined in `src/lib/auth/authorization.ts`:

```typescript
export const ACTION_PERMISSIONS = {
  // Questionnaire actions
  'questionnaires:create': 'editor',
  'questionnaires:read': 'viewer',
  'questionnaires:update': 'editor',
  'questionnaires:delete': 'admin',
  
  // Template actions
  'templates:create': 'editor',
  'templates:read': 'viewer',
  'templates:update': 'editor',
  'templates:delete': 'admin',
  
  // Workspace management
  'workspace:update': 'admin',
  'workspace:billing': 'admin',
  'workspace:members:invite': 'admin',
  'workspace:members:remove': 'admin',
  'workspace:members:update-role': 'admin',
};
```

**Usage Example:**

```typescript
import { canPerformAction } from '@/lib/auth/authorization';

// Check if user can delete a questionnaire
if (canPerformAction(ctx, 'questionnaires:delete')) {
  // Proceed with deletion
}

// Check if user can invite members
if (canPerformAction(ctx, 'workspace:members:invite')) {
  // Show invite button
}
```

### Implementation Files

1. **`src/lib/workspace.ts`** - Workspace helper functions
2. **`src/lib/auth/authorization.ts`** - RBAC authorization logic
3. **`src/types/index.ts`** - TypeScript type definitions

## Migration Strategy

### For Existing Users

A migration function creates a default workspace for each existing user:

```sql
CREATE OR REPLACE FUNCTION migrate_users_to_workspaces()
```

This function:
1. Creates a personal workspace for each user
2. Adds the user as admin of their workspace
3. Migrates existing questionnaires to the workspace
4. Migrates subscriptions to workspace-level

### For New Users

New users will automatically get a workspace created upon signup.

## API Changes

### Before (User-Based)
```typescript
GET /api/questionnaires?user_id=xxx
```

### After (Workspace-Based)
```typescript
GET /api/questionnaires?workspace_id=xxx
Authorization: Bearer <token>
X-Workspace-ID: xxx
X-User-Role: admin
```

**Request Headers:**
- `Authorization`: User authentication token
- `X-Workspace-ID`: The workspace context for the request
- `X-User-Role`: User's role in the workspace (`viewer`, `editor`, or `admin`)

**Response Status Codes:**
- `200`: Success
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (insufficient permissions for action)
- `404`: Not found or not in workspace

### Authorization Checks

All API routes must check:
1. **Authentication**: Is the user logged in?
2. **Authorization**: Does the user have permission in this workspace?

Example:
```typescript
// In API route
const ctx = await getAuthorizationContext(request, userId, workspaceId);
if (!canPerformAction(ctx, 'questionnaires:delete')) {
  return new Response('Forbidden', { status: 403 });
}
```

**Common Action Permission Checks:**

```typescript
// Reading resources
canPerformAction(ctx, 'questionnaires:read')  // viewer or higher
canPerformAction(ctx, 'templates:read')       // viewer or higher

// Creating/updating resources
canPerformAction(ctx, 'questionnaires:create')  // editor or higher
canPerformAction(ctx, 'questionnaires:update')  // editor or higher
canPerformAction(ctx, 'templates:create')       // editor or higher
canPerformAction(ctx, 'templates:update')       // editor or higher

// Deleting resources
canPerformAction(ctx, 'questionnaires:delete')  // admin only
canPerformAction(ctx, 'templates:delete')       // admin only

// Workspace management
canPerformAction(ctx, 'workspace:update')              // admin only
canPerformAction(ctx, 'workspace:billing')             // admin only
canPerformAction(ctx, 'workspace:members:invite')      // admin only
canPerformAction(ctx, 'workspace:members:remove')      // admin only
canPerformAction(ctx, 'workspace:members:update-role') // admin only
```

## Row Level Security (RLS)

When connected to Supabase, implement RLS policies:

```sql
-- Example RLS policy for questionnaires
CREATE POLICY "Users can view questionnaires in their workspaces"
ON questionnaires FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);
```

## UI Changes

### Role-Based UI Rendering

Components should hide/show actions based on user role:

```typescript
{userRole === 'admin' && (
  <button onClick={deleteQuestionnaire}>
    Delete
  </button>
)}
```

### Workspace Switcher

Add a workspace switcher to the dashboard to allow users to switch between workspaces they're members of.

## Business Plan Benefits

This architecture enables the Business plan features:

1. **Team Collaboration**: Multiple users can work on the same questionnaires
2. **Role Management**: Fine-grained access control
3. **Workspace Billing**: Subscriptions at workspace level ($50/month per seat)
4. **Audit Trail**: Track who did what via `invited_by` and other fields

## Security Considerations

1. **Always check authorization**, not just authentication
2. **Validate workspace membership** before any operation
3. **Use RLS policies** in database layer
4. **Audit sensitive operations** (member removal, role changes)
5. **Prevent privilege escalation** (viewers can't make themselves admins)

## Next Steps

1. Update all API routes to use workspace-based queries
2. Implement workspace creation on user signup
3. Build workspace management UI
4. Add member invitation system
5. Update subscription flow to workspace-level
6. Implement RLS policies in Supabase
7. Add analytics for workspace-level usage

## Testing Checklist

- [ ] Create workspace as new user
- [ ] Invite member to workspace
- [ ] Test admin can delete, editor cannot
- [ ] Test viewer can only read
- [ ] Test workspace isolation (User A can't see User B's workspace data)
- [ ] Test role changes (admin demoting another admin)
- [ ] Test subscription at workspace level
