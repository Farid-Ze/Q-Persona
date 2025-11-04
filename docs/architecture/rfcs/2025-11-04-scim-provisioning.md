# RFC: SCIM 2.0 Provisioning (Users & Groups)

Goal: Enterprise-safe user lifecycle management integrated with IdPs (Okta, Azure AD) to eliminate orphaned access.

Scope (MVP)
- Auth: Workspace-scoped SCIM tokens (`scim_tokens`) with Bearer auth.
- Endpoints: `/api/scim/v2/Users`, `/api/scim/v2/Groups` (CRUD per SCIM spec).
- Actions: Create/Deactivate users, assign roles, group-to-role mapping.

Data model
- `scim_tokens(id, workspace_id, name, token_hash, key_prefix, is_active, last_used_at, created_at, updated_at)`
- Users: Reuse `users` + `workspace_members` with soft-deletion flag on membership.

Security & audit
- Token hashed at rest, prefix shown UI.
- All actions recorded in `audit_logs`.

Phases
1) Token issuance UI + basic Users create/deactivate (hard delete avoided).
2) Group sync to roles, PATCH ops, paging/filtering.
3) Deeper mapping (attributes), SCIM ETag, 412 preconditions.

Notes
- Stubs added at `/src/app/api/scim/v2/*` returning 501 with auth.
- Add UI section under SSO settings to manage SCIM tokens and rotate.
