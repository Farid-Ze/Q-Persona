# RFC: Vendor Abstraction & DR Readiness

Motivation
- Reduce coupling to Supabase/Vercel; ease re-platforming; improve SLA.

Approach
- Data Access Layer: Introduce repositories (`src/lib/data/*`). Start refactoring server routes to use interfaces, enabling alternative backends.
- Auth Abstraction: Consider moving to vendor-agnostic auth providers or wrap current supabase auth calls.
- DR: Configure read replicas / cross-region and document failover.

Phases
1) Adopt repositories in new code; refactor hot paths gradually.
2) Define interfaces for auth/session and storage.
3) Extract env/config for runtime parity across platforms.
