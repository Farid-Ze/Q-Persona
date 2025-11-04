/**
 * Public API v1 - Responses Endpoint
 * Recommendation #2: Public API for external integrations
 * Allows fetching and creating survey responses via API
 */

import { NextRequest, NextResponse } from 'next/server'

// Simple API key authentication (shared logic - in production, extract to middleware)
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
  const apiKey = await authenticateApiKey(request)

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    )
  }

  const scopes = apiKey.scopes || []
  if (!scopes.includes('read:responses')) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'API key does not have required scope: read:responses' },
      { status: 403 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const questionnaireId = searchParams.get('questionnaire_id')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!questionnaireId) {
      return NextResponse.json(
        { error: 'Bad request', message: 'questionnaire_id is required' },
        { status: 400 }
      )
    }

    // Fetch respondents for questionnaire
    const respondentsResponse = await fetch(
      `${supabaseUrl}/rest/v1/respondents?questionnaire_id=eq.${questionnaireId}&limit=${limit}&offset=${offset}&order=completed_at.desc`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!respondentsResponse.ok) {
      throw new Error('Failed to fetch respondents')
    }

    const respondents = await respondentsResponse.json()

    // Fetch answers for each respondent
    const responsesWithAnswers = await Promise.all(
      respondents.map(async (respondent: any) => {
        const answersResponse = await fetch(
          `${supabaseUrl}/rest/v1/answers?respondent_id=eq.${respondent.id}`,
          {
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
            },
          }
        )

        const answers = answersResponse.ok ? await answersResponse.json() : []

        return {
          id: respondent.id,
          email: respondent.email,
          name: respondent.name,
          metadata: respondent.metadata,
          started_at: respondent.started_at,
          completed_at: respondent.completed_at,
          answers: answers,
        }
      })
    )

    return NextResponse.json({
      data: responsesWithAnswers,
      meta: {
        questionnaire_id: questionnaireId,
        limit,
        offset,
        count: responsesWithAnswers.length,
      },
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const apiKey = await authenticateApiKey(request)

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    )
  }

  const scopes = apiKey.scopes || []
  if (!scopes.includes('write:responses')) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'API key does not have required scope: write:responses' },
      { status: 403 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  try {
    const body = await request.json()

    if (!body.questionnaire_id || !body.answers) {
      return NextResponse.json(
        { error: 'Bad request', message: 'questionnaire_id and answers are required' },
        { status: 400 }
      )
    }

    // Create respondent
    const respondentResponse = await fetch(`${supabaseUrl}/rest/v1/respondents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        questionnaire_id: body.questionnaire_id,
        email: body.email || null,
        name: body.name || null,
        metadata: body.metadata || {},
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      }),
    })

    if (!respondentResponse.ok) {
      throw new Error('Failed to create respondent')
    }

    const respondent = await respondentResponse.json()
    const respondentId = respondent[0].id

    // Create answers
    const answerPromises = body.answers.map((answer: any) =>
      fetch(`${supabaseUrl}/rest/v1/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          respondent_id: respondentId,
          question_id: answer.question_id,
          value: answer.value,
          created_at: new Date().toISOString(),
        }),
      })
    )

    await Promise.all(answerPromises)

    // Trigger webhooks for response.created event
    await triggerWebhooks(apiKey.workspace_id, 'response.created', {
      respondent_id: respondentId,
      questionnaire_id: body.questionnaire_id,
      email: body.email,
      name: body.name,
      completed_at: new Date().toISOString(),
    })

    return NextResponse.json({
      data: {
        respondent_id: respondentId,
        message: 'Response submitted successfully',
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to trigger webhooks
async function triggerWebhooks(workspaceId: string, eventType: string, payload: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return
  }

  try {
    // Fetch active webhooks for this workspace and event type
    const webhooksResponse = await fetch(
      `${supabaseUrl}/rest/v1/webhooks?workspace_id=eq.${workspaceId}&is_active=eq.true`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!webhooksResponse.ok) {
      return
    }

    const webhooks = await webhooksResponse.json()

    // Trigger each webhook that matches the event type
    const triggerPromises = webhooks
      .filter((webhook: any) => webhook.event_types.includes(eventType))
      .map(async (webhook: any) => {
        try {
          const deliveryResponse = await fetch(webhook.target_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-QPersona-Event': eventType,
              'X-QPersona-Signature': webhook.secret || '',
            },
            body: JSON.stringify(payload),
          })

          // Log delivery
          await fetch(`${supabaseUrl}/rest/v1/webhook_deliveries`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
              webhook_id: webhook.id,
              event_type: eventType,
              payload: payload,
              response_status: deliveryResponse.status,
              response_body: await deliveryResponse.text(),
              delivered_at: new Date().toISOString(),
              success: deliveryResponse.ok,
            }),
          })

          // Update webhook stats
          const updateField = deliveryResponse.ok ? 'success_count' : 'failure_count'
          await fetch(`${supabaseUrl}/rest/v1/webhooks?id=eq.${webhook.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
              [updateField]: webhook[updateField] + 1,
              last_triggered_at: new Date().toISOString(),
            }),
          })
        } catch (error) {
          console.error('Webhook delivery failed:', error)
        }
      })

    await Promise.all(triggerPromises)
  } catch (error) {
    console.error('Error triggering webhooks:', error)
  }
}
