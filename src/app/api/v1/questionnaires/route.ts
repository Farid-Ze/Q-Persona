/**
 * Public API v1 - Questionnaires Endpoint
 * Recommendation #2: Public API for external integrations
 * Allows authenticated API access using workspace API keys
 */

import { NextRequest, NextResponse } from 'next/server'
import { logApiRequest, incrementApiKeyUsage } from '@/lib/api/logging'

// Simple API key authentication
async function authenticateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const apiKey = authHeader.substring(7)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return null
  }

  try {
    // TODO: In production, hash API keys using bcrypt before storage
    // and compare hashed values here instead of plain text
    // For simplicity, we're doing a direct comparison (in production, use proper hashing)
    const response = await fetch(
      `${supabaseUrl}/rest/v1/workspace_api_keys?key_hash=eq.${apiKey}&is_active=eq.true`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const keys = await response.json()

    if (keys.length === 0) {
      return null
    }

    // Update last_used_at
    const keyId = keys[0].id
    await fetch(`${supabaseUrl}/rest/v1/workspace_api_keys?id=eq.${keyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        last_used_at: new Date().toISOString(),
      }),
    })

    return keys[0]
  } catch (error) {
    console.error('API key authentication error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const start = Date.now()
  // Authenticate request
  const apiKey = await authenticateApiKey(request)

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    )
  }

  // Check if API key has required scope
  const scopes = apiKey.scopes || []
  if (!scopes.includes('read:questionnaires')) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'API key does not have required scope: read:questionnaires' },
      { status: 403 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Configuration error' },
      { status: 500 }
    )
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch questionnaires
    let url = `${supabaseUrl}/rest/v1/questionnaires?status=eq.${status}&limit=${limit}&offset=${offset}&order=created_at.desc`

    const response = await fetch(url, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch questionnaires')
    }

    const questionnaires = await response.json()

    const res = NextResponse.json({
      data: questionnaires,
      meta: {
        limit,
        offset,
        count: questionnaires.length,
      },
    })
    await Promise.all([
      incrementApiKeyUsage(apiKey.id),
      logApiRequest({ apiKey, request, status: 200, latencyMs: Date.now() - start })
    ])
    return res
  } catch (error) {
    console.error('Error fetching questionnaires:', error)
    const res = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    await logApiRequest({ apiKey, request, status: 500, latencyMs: Date.now() - start })
    return res
  }
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  // Authenticate request
  const apiKey = await authenticateApiKey(request)

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    )
  }

  // Check if API key has required scope
  const scopes = apiKey.scopes || []
  if (!scopes.includes('write:questionnaires')) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'API key does not have required scope: write:questionnaires' },
      { status: 403 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Configuration error' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.template_id || !body.title) {
      return NextResponse.json(
        { error: 'Bad request', message: 'template_id and title are required' },
        { status: 400 }
      )
    }

    // Create questionnaire
    const response = await fetch(`${supabaseUrl}/rest/v1/questionnaires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        template_id: body.template_id,
        title: body.title,
        description: body.description || '',
        status: body.status || 'draft',
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        created_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create questionnaire')
    }

    const questionnaire = await response.json()

    const res = NextResponse.json({
      data: questionnaire[0],
    }, { status: 201 })
    await Promise.all([
      incrementApiKeyUsage(apiKey.id),
      logApiRequest({ apiKey, request, status: 201, latencyMs: Date.now() - start, metadata: { template_id: body.template_id } })
    ])
    return res
  } catch (error) {
    console.error('Error creating questionnaire:', error)
    const res = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    await logApiRequest({ apiKey, request, status: 500, latencyMs: Date.now() - start })
    return res
  }
}
