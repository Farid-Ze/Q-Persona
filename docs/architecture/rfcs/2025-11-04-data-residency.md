# RFC: Data Residency and Multi-Region Strategy

- Date: 2025-11-04
- Status: Draft

## Summary
Introduce a plan-gated data residency capability and a path to multi-region processing:
- Add a `data_region` hint on subscriptions (US/EU/APAC)
- Route data-plane operations based on region hint
- Prepare for multiple providers via service adapters (DB/Auth/Storage/Realtime)

## Goals
- Enterprise compliance (EU data stays in-region)
- Minimize lock-in by isolating provider specifics behind adapters
- Start incremental without breaking changes; expand coverage over time

## Phases
1. Flags and schema
   - Add `feature_flags`, `plan_feature_flags`, and `subscriptions.data_region` (done)
   - Gate UI/features (SSO/SCIM/residency) by plan
2. Region-aware clients
   - Provide helpers to select regional endpoints via env: `SUPABASE_URL_US`, `SUPABASE_URL_EU`, `SUPABASE_URL_APAC`
   - Fall back to default when unset
3. Coverage expansion
   - Move DB reads/writes for sensitive tables to regional clients
   - Extend to Storage and Realtime via adapters
4. Validation & compliance
   - Audit logs keyed by region
   - Residency tests in CI and runbooks

## Configuration
- `NEXT_PUBLIC_SUPABASE_URL` (default)
- `SUPABASE_SERVICE_KEY` (default)
- Optional region-specific:
  - `SUPABASE_URL_US`, `SUPABASE_URL_EU`, `SUPABASE_URL_APAC`
  - `SUPABASE_SERVICE_KEY_US`, `SUPABASE_SERVICE_KEY_EU`, `SUPABASE_SERVICE_KEY_APAC`

## Risks
- Cross-region aggregate queries may regress; solve with asynchronous fan-in
- Increased complexity in observability; mitigate with per-region dashboards

## Open Questions
- Workspace entity ownership of region vs subscription hint (migrate later)
- Pricing model for region selection (single vs multiple regions)
