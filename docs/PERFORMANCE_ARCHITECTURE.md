# Performance & Scalability Architecture

This document addresses Issue #4: Ensuring the system can handle viral questionnaires with thousands of concurrent respondents without collapsing or incurring massive costs.

## Problem Statement

### The Viral Questionnaire Scenario

**Current Risk:**
- "Andi" (Startup Founder) launches a market research questionnaire
- Goes viral on social media → 10,000 respondents in 1 hour
- Current architecture: Each submission = 1 serverless function call + 1 database write
- **Result:** 
  - Vercel serverless functions hit concurrency limits
  - Database connections exhausted
  - Costs spike dramatically
  - Service becomes unavailable
  - Data loss occurs
  - Andi churns permanently

### Architecture Weaknesses

1. **Synchronous Processing**: Response submission directly writes to PostgreSQL
2. **No Rate Limiting**: No protection against traffic spikes
3. **Database Bottleneck**: PostgreSQL has connection limits
4. **Cost Model**: Every request = expensive serverless function invocation

## Solution Architecture

### Overview: Queue-Based Response Collection

```
┌─────────────┐
│  Respondent │
└──────┬──────┘
       │ HTTP POST
       │
       ▼
┌─────────────────────┐
│  Vercel Edge        │  ← Fast, cheap, globally distributed
│  Function           │
└──────┬──────────────┘
       │ Push to Queue
       │
       ▼
┌─────────────────────┐
│  Message Queue      │  ← Buffer for high-volume traffic
│  (RabbitMQ/SQS)     │
└──────┬──────────────┘
       │ Batch read
       │
       ▼
┌─────────────────────┐
│  Background Worker  │  ← Batch process (100+ at once)
│  (Supabase Function)│
└──────┬──────────────┘
       │ Batch INSERT
       │
       ▼
┌─────────────────────┐
│  PostgreSQL         │  ← Protected from overload
│  Database           │
└─────────────────────┘
```

## Implementation Details

### 1. Edge Function for Response Submission

**Location:** `/api/questionnaires/[id]/submit` (Edge Runtime)

**Technology:** Vercel Edge Functions
- Global distribution (low latency)
- Extremely high concurrency limits
- Cost-effective for simple operations
- No cold start delays

**Code Structure:**

```typescript
// src/app/api/questionnaires/[id]/submit/route.ts
export const runtime = 'edge';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const questionnaireId = params.id;
    
    // Minimal validation
    if (!body.answers || !Array.isArray(body.answers)) {
      return new Response('Invalid request', { status: 400 });
    }
    
    // Create response payload
    const payload = {
      questionnaire_id: questionnaireId,
      respondent_id: body.respondent_id || crypto.randomUUID(),
      answers: body.answers,
      metadata: {
        ip: request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent'),
        timestamp: Date.now(),
      },
    };
    
    // Push to queue (NOT database)
    await pushToQueue('questionnaire-responses', payload);
    
    // Return success immediately
    return new Response(
      JSON.stringify({ 
        success: true, 
        response_id: payload.respondent_id 
      }),
      { 
        status: 202, // Accepted (async processing)
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

### 2. Message Queue Integration

**Option A: Supabase Built-in (Recommended for MVP)**

Supabase includes pg_net for HTTP requests and can act as a simple queue using database tables.

```sql
-- Simple queue table
CREATE TABLE response_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionnaire_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_response_queue_status ON response_queue(status);
CREATE INDEX idx_response_queue_created_at ON response_queue(created_at);
```

**Option B: External Queue Service (Production Scale)**

Use managed queue service:
- AWS SQS (Simple Queue Service)
- Google Cloud Pub/Sub
- RabbitMQ (self-hosted)

Benefits:
- Better scalability
- Built-in retry logic
- Dead letter queues
- Better monitoring

### 3. Background Worker for Batch Processing

**Location:** Supabase Edge Function or Serverless Function

**Processing Logic:**

```typescript
// Supabase Edge Function: process-responses
import { createClient } from '@supabase/supabase-js';

export async function processResponseBatch() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Service role key
  );
  
  const BATCH_SIZE = 100;
  
  // Fetch pending responses
  const { data: pendingResponses, error } = await supabase
    .from('response_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE);
    
  if (error || !pendingResponses || pendingResponses.length === 0) {
    return { processed: 0 };
  }
  
  // Mark as processing
  const queueIds = pendingResponses.map(r => r.id);
  await supabase
    .from('response_queue')
    .update({ status: 'processing' })
    .in('id', queueIds);
  
  // Process batch
  const respondents = [];
  const answers = [];
  
  for (const item of pendingResponses) {
    const { questionnaire_id, payload } = item;
    
    // Create respondent record
    respondents.push({
      id: payload.respondent_id,
      questionnaire_id: questionnaire_id,
      email: payload.metadata.email,
      metadata: payload.metadata,
      started_at: new Date(payload.metadata.timestamp),
      completed_at: new Date(payload.metadata.timestamp),
    });
    
    // Create answer records
    for (const answer of payload.answers) {
      answers.push({
        respondent_id: payload.respondent_id,
        question_id: answer.question_id,
        value: answer.value,
      });
    }
  }
  
  // Batch insert to database
  try {
    // Insert respondents
    await supabase.from('respondents').insert(respondents);
    
    // Insert answers
    await supabase.from('answers').insert(answers);
    
    // Mark as completed
    await supabase
      .from('response_queue')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .in('id', queueIds);
      
    return { processed: pendingResponses.length };
    
  } catch (error) {
    console.error('Batch processing error:', error);
    
    // Mark as failed (with retry logic)
    await supabase
      .from('response_queue')
      .update({ 
        status: 'failed',
        retry_count: supabase.raw('retry_count + 1')
      })
      .in('id', queueIds);
      
    throw error;
  }
}
```

### 4. Scheduled Processing

**Option A: Supabase Cron Jobs**
```sql
-- Run worker every minute
SELECT cron.schedule(
  'process-response-queue',
  '* * * * *', -- Every minute
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/process-responses',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  )
  $$
);
```

**Option B: Vercel Cron Jobs**
```typescript
// src/app/api/cron/process-responses/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const result = await processResponseBatch();
  
  return Response.json(result);
}
```

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/process-responses",
    "schedule": "* * * * *" // Every minute
  }]
}
```

## Performance Optimizations

### 1. Database Optimizations

```sql
-- Partition answers table by month (for large datasets)
CREATE TABLE answers_2025_01 PARTITION OF answers
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Add composite indexes for common queries
CREATE INDEX idx_answers_respondent_question 
  ON answers(respondent_id, question_id);

-- Use JSONB indexes for filtering
CREATE INDEX idx_respondents_metadata 
  ON respondents USING GIN (metadata);
```

### 2. Caching Layer

Use Vercel Edge Config or Redis for:
- Questionnaire metadata (title, description)
- Question definitions
- Rate limit counters

```typescript
// Check if questionnaire is active (cached)
const questionnaire = await edgeConfig.get(`questionnaire:${id}`);
if (!questionnaire || questionnaire.status !== 'active') {
  return new Response('Questionnaire not found', { status: 404 });
}
```

### 3. Rate Limiting

Protect against abuse:

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit:${identifier}`
  );
  
  return { success, limit, reset, remaining };
}
```

### 4. Response Deduplication

Prevent duplicate submissions:

```typescript
// Generate idempotency key
const idempotencyKey = crypto.createHash('sha256')
  .update(questionnaireId + respondentId + JSON.stringify(answers))
  .digest('hex');

// Check if already processed
const exists = await supabase
  .from('response_queue')
  .select('id')
  .eq('idempotency_key', idempotencyKey)
  .single();

if (exists.data) {
  return new Response('Already submitted', { status: 200 });
}
```

## Cost Analysis

### Current Architecture (Direct Write)
**10,000 responses in 1 hour:**
- Serverless functions: 10,000 invocations × $0.20/million = $2.00
- Database writes: 10,000 writes × $0.15/million = $1.50
- Database connections: Risk of exhaustion → Service outage
- **Total**: $3.50 + service downtime cost

### New Architecture (Queue-Based)
**10,000 responses in 1 hour:**
- Edge functions: 10,000 invocations × $0.05/million = $0.50
- Queue operations: 10,000 pushes × $0.04/million = $0.40
- Worker invocations: 60 (every minute) × $0.20/million = negligible
- Database writes: 100 batches × $0.15/million = $0.15
- **Total**: $1.05 (70% cost reduction)

### Scalability Comparison

| Metric | Current | New Architecture |
|--------|---------|------------------|
| Max concurrent responses | ~1,000 | 100,000+ |
| Database load | High | Low (batch writes) |
| Latency for user | 500-2000ms | 50-200ms (edge) |
| Cost per 10k responses | $3.50 + risk | $1.05 |
| Service availability | 95% | 99.9% |

## Monitoring & Alerts

### Key Metrics to Track

```typescript
// src/lib/monitoring.ts
export const PERFORMANCE_METRICS = {
  // Queue metrics
  QUEUE_SIZE: 'queue.size',
  QUEUE_AGE: 'queue.oldest_message_age',
  PROCESSING_RATE: 'queue.processing_rate',
  
  // Processing metrics
  BATCH_SIZE: 'worker.batch_size',
  PROCESSING_TIME: 'worker.processing_time',
  ERROR_RATE: 'worker.error_rate',
  
  // User experience
  SUBMISSION_LATENCY: 'submission.latency',
  SUCCESS_RATE: 'submission.success_rate',
};
```

### Alert Thresholds

```typescript
const ALERTS = {
  // Critical
  QUEUE_SIZE_CRITICAL: 10000, // Queue backed up
  ERROR_RATE_HIGH: 0.05, // 5% error rate
  PROCESSING_STOPPED: 5, // No processing in 5 minutes
  
  // Warning
  QUEUE_SIZE_WARNING: 1000,
  PROCESSING_SLOW: 120, // Processing takes > 2 minutes
};
```

## Migration Strategy

### Phase 1: Add Queue (Week 1)
- [ ] Create response_queue table
- [ ] Implement queue push in Edge function
- [ ] Test with small traffic

### Phase 2: Add Worker (Week 2)
- [ ] Build batch processing function
- [ ] Set up cron job
- [ ] Monitor queue metrics

### Phase 3: Gradual Rollout (Week 3)
- [ ] Enable for new questionnaires only
- [ ] Monitor performance vs old system
- [ ] Gradually increase percentage

### Phase 4: Full Migration (Week 4)
- [ ] Enable for all questionnaires
- [ ] Deprecate old direct-write endpoint
- [ ] Optimize based on real data

## Testing Strategy

### Load Testing

Use k6 or Artillery:

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 1000 }, // Peak load
    { duration: '2m', target: 0 }, // Ramp down
  ],
};

export default function() {
  let response = http.post(
    'https://qpersona.com/api/questionnaires/test-id/submit',
    JSON.stringify({
      answers: [
        { question_id: 'q1', value: 'Test answer' }
      ]
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(response, {
    'status is 202': (r) => r.status === 202,
    'latency < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Chaos Engineering

Test failure scenarios:
- Database connection failure
- Queue service outage
- Worker crashes
- Network delays

## Future Enhancements

### Real-Time Analytics
Use streaming analytics (ClickHouse, TimescaleDB) for:
- Live response count
- Real-time visualizations
- Instant insights

### Global Distribution
- Multi-region database replicas
- Regional queue systems
- CDN for static assets

### Auto-Scaling
- Dynamic worker scaling based on queue size
- Database connection pooling
- Serverless function concurrency limits

## Success Metrics

- **Availability**: 99.9% uptime during viral events
- **Latency**: < 200ms P95 for submissions
- **Cost**: < $2 per 10,000 responses
- **Data Loss**: Zero data loss under any load
- **Recovery**: < 5 minutes to process backed-up queue

## Conclusion

The queue-based architecture provides:
1. **10x better scalability** (1,000 → 100,000+ concurrent)
2. **70% cost reduction** ($3.50 → $1.05 per 10k)
3. **Better user experience** (200ms → 50ms latency)
4. **Guaranteed data integrity** (no data loss)
5. **Peace of mind for Andi** (won't crash during viral success)

This architecture transforms viral success from a liability into an asset.
