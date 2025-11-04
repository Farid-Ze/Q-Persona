/**
 * Webhooks Management API
 * Recommendation #2: Allows users to manage outbound webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/app/actions/auth'

export async function GET(request: NextRequest) {
  const { user } = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }
  
  try {
    // Fetch webhooks for user
    const response = await fetch(
      `${supabaseUrl}/rest/v1/webhooks?user_id=eq.${user.id}&order=created_at.desc`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch webhooks')
    }
    
    const webhooks = await response.json()
    
    return NextResponse.json({ data: webhooks })
  } catch (error) {
    console.error('Error fetching webhooks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { user } = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }
  
  try {
    const body = await request.json()
    
    if (!body.name || !body.target_url) {
      return NextResponse.json(
        { error: 'Bad request', message: 'name and target_url are required' },
        { status: 400 }
      )
    }
    
    // Generate secret for webhook signature
    const secret = generateWebhookSecret()
    
    const response = await fetch(`${supabaseUrl}/rest/v1/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        workspace_id: body.workspace_id || 'default-workspace',
        user_id: user.id,
        name: body.name,
        target_url: body.target_url,
        event_types: body.event_types || ['response.created', 'response.completed'],
        secret: secret,
        is_active: true,
        created_at: new Date().toISOString(),
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create webhook')
    }
    
    const webhook = await response.json()
    
    return NextResponse.json({ data: webhook[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { user } = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { searchParams } = new URL(request.url)
  const webhookId = searchParams.get('id')
  
  if (!webhookId) {
    return NextResponse.json(
      { error: 'Bad request', message: 'id is required' },
      { status: 400 }
    )
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/webhooks?id=eq.${webhookId}&user_id=eq.${user.id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to delete webhook')
    }
    
    return NextResponse.json({ message: 'Webhook deleted successfully' })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateWebhookSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let secret = 'whsec_'
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}
