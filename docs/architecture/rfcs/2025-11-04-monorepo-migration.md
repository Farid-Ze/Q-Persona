# RFC: Managed Monorepo Migration (Turborepo)

- Date: 2025-11-04
- Status: Draft

## Summary
Adopt Turborepo to manage a monorepo housing the Next.js web app, shared packages (types, UI, adapters), infrastructure code, and e2e tests.

## Objectives
- Speed up CI with remote caching and task pipelines
- Enforce consistent tooling across packages
- Isolate boundaries (web, workers, shared libs) to unlock parallel development

## Proposed Structure
- apps/
  - web (Next.js)
  - worker (cron/queue processors)
- packages/
  - ui (shared components)
  - config (eslint, tsconfig, tailwind)
  - core (domain types, repositories, service adapters)
- infra/
  - db (migrations, schema)
  - ops (IaC, environments)

## Initial Steps
1. Add `turbo.json` and minimal pipeline (build, lint, test)
2. Extract shared types to `packages/core`
3. Move migrations to `infra/db` with dual-publish into current path for backward compatibility
4. Update CI to run `turbo run build lint test`

## Risks
- Short-term churn; mitigate via incremental extraction and adapter interfaces
- Toolchain integration (Playwright, Next): use `pipeline` + `dependsOn` correctly

## Success Criteria
- CI time decrease > 30% (estimate) with remote caching
- Clear owner boundaries per app/package
- No regression in developer UX (pnpm/npm scripts remain consistent)
