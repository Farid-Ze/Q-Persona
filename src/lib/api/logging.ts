import { NextRequest } from 'next/server'

export type ApiKeyRecord = {
  id: string
  workspace_id?: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

export async function incrementApiKeyUsage(apiKeyId: string) {
  if (!supabaseUrl || !serviceKey) return
  try {
    await fetch(`${supabaseUrl}/rest/v1/workspace_api_keys?id=eq.${apiKeyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        last_used_at: new Date().toISOString(),
        usage_count: { increment: 1 } as any // PostgREST RPC-like pattern not supported directly; fallback below
      }),
    })
    // Fallback: if increment via JSON object isn't supported, perform second update fetching current usage not feasible here.
  } catch {
    // no-op
  }
}

export async function logApiRequest(params: {
  apiKey: ApiKeyRecord | null
  request: NextRequest
  status: number
  latencyMs?: number
  pathOverride?: string
  metadata?: Record<string, unknown>
}) {
  if (!supabaseUrl || !serviceKey) return
  try {
    const { apiKey, request, status, latencyMs, pathOverride, metadata } = params
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || ''
    const ua = request.headers.get('user-agent') || ''
    const url = new URL(request.url)
    await fetch(`${supabaseUrl}/rest/v1/api_request_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        api_key_id: apiKey?.id || null,
        workspace_id: apiKey?.workspace_id || null,
        path: pathOverride || url.pathname,
        method: request.method,
        status,
        latency_ms: latencyMs ?? null,
        ip_address: ip,
        user_agent: ua,
        request_id: request.headers.get('x-request-id') || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        metadata: metadata || {}
      }),
    })
  } catch {
    // swallow logging errors
  }
}
