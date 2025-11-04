# RFC: Incremental, Near Real-time Benchmarks

Problem: Nightly batch produces stale insights and scales poorly.

Design
- Trigger recalculation on ingestion success, not on a time schedule.
- Scope recomputation to the impacted questionnaire/template category.
- Upsert daily `benchmark_scores` rows for mean/median/pXX.

API
- New internal route: `POST /api/internal/benchmarks/incremental` with `{ questionnaire_id }` and internal secret auth.
- Can be called by the ingestion worker after batch insert or a queue.

Future Enhancements
- Maintain auxiliary aggregates table (sum, count) per category for O(1) mean updates.
- Consider windowed metrics (last 7/28/90 days).
- Eventually, materialize per-workspace or per-segment benchmarks.

Status
- Stub route implemented; wiring from `process-responses` pending to avoid runtime risk in this pass.
