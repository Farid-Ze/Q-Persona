import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerAuthAdapter } from '@/lib/services/authAdapter'
import { trackPersonaSelected, trackOnboardingCompleted } from '@/lib/analytics/server'

/**
 * User Personas API
 * Manages the many-to-many relationship between users and personas
 */

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = getServerAuthAdapter()
    const authUser = await auth.getUserFromRequest(req.headers)

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's personas with full persona details
    const { data, error } = await supabase
      .from('user_personas')
      .select(`
        id,
        created_at,
        personas (*)
      `)
      .eq('user_id', authUser.id)

    if (error) {
      console.error('Error fetching user personas:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = getServerAuthAdapter()
    const authUser = await auth.getUserFromRequest(req.headers)

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { persona_ids } = body

    if (!persona_ids || !Array.isArray(persona_ids) || persona_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'persona_ids array is required' },
        { status: 400 }
      )
    }

    // Delete existing user personas (allow users to re-select)
    await supabase
      .from('user_personas')
      .delete()
      .eq('user_id', authUser.id)

    // Insert new user personas
    const insertData = persona_ids.map(persona_id => ({
      user_id: authUser.id,
      persona_id,
    }))

    const { data, error } = await supabase
      .from('user_personas')
      .insert(insertData)
      .select(`
        id,
        created_at,
        personas (*)
      `)

    if (error) {
      console.error('Error creating user personas:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Track analytics events
    if (data && data.length > 0) {
      // Track onboarding completed
      await trackOnboardingCompleted(authUser.id, data.length)

      // Track each persona selection
      for (const item of data) {
        const persona = (item as any).personas
        if (persona) {
          await trackPersonaSelected(authUser.id, persona.id, persona.name)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = getServerAuthAdapter()
    const authUser = await auth.getUserFromRequest(req.headers)

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const personaId = searchParams.get('persona_id')

    if (!personaId) {
      return NextResponse.json(
        { success: false, error: 'persona_id is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('user_personas')
      .delete()
      .eq('user_id', authUser.id)
      .eq('persona_id', personaId)

    if (error) {
      console.error('Error deleting user persona:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
