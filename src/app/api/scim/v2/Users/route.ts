import { NextRequest, NextResponse } from 'next/server'

async function authenticateScimToken(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) return null
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/scim_tokens?token_hash=eq.${token}&is_active=eq.true`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    })
    if (!res.ok) return null
    const rows = await res.json()
    const tokenRow = rows[0]
    if (!tokenRow) return null
    // touch last_used_at
    await fetch(`${supabaseUrl}/rest/v1/scim_tokens?id=eq.${tokenRow.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` },
      body: JSON.stringify({ last_used_at: new Date().toISOString() })
    })
    return tokenRow
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const token = await authenticateScimToken(request)
  if (!token) {
    return NextResponse.json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: 'Unauthorized' }, { status: 401 })
  }
  // List/Query Users per SCIM spec
  return NextResponse.json({ detail: 'SCIM Users listing not implemented yet' }, { status: 501 })
}

export async function POST(request: NextRequest) {
  const token = await authenticateScimToken(request)
  if (!token) {
    return NextResponse.json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: 'Unauthorized' }, { status: 401 })
  }
  // Create/Provision User
  return NextResponse.json({ detail: 'SCIM User provisioning not implemented yet' }, { status: 501 })
}

export async function PATCH(request: NextRequest) {
  const token = await authenticateScimToken(request)
  if (!token) {
    return NextResponse.json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: 'Unauthorized' }, { status: 401 })
  }
  // Patch/Update User (e.g., deactivate)
  return NextResponse.json({ detail: 'SCIM User patch not implemented yet' }, { status: 501 })
}

export async function DELETE(request: NextRequest) {
  const token = await authenticateScimToken(request)
  if (!token) {
    return NextResponse.json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: 'Unauthorized' }, { status: 401 })
  }
  // De-provision User
  return NextResponse.json({ detail: 'SCIM User deprovision not implemented yet' }, { status: 501 })
}

export const runtime = 'edge'
