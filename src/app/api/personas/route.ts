import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Persona } from '@/types';
import { createClient } from '@/lib/supabase/server';

// GET /api/personas - List all personas (primarily system personas for onboarding)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get system_only param to filter system personas
    const searchParams = request.nextUrl.searchParams;
    const systemOnly = searchParams.get('system_only') === 'true';
    
    let query = supabase
      .from('personas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (systemOnly) {
      query = query.eq('is_system', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching personas:', error)
      const response: ApiResponse<Persona[]> = {
        success: false,
        error: error.message
      };
      return NextResponse.json(response, { status: 500 });
    }
    
    const response: ApiResponse<Persona[]> = {
      success: true,
      data: data || []
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Persona[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/personas - Create a new persona (for custom personas)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      const response: ApiResponse<Persona> = {
        success: false,
        error: 'Name is required'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('personas')
      .insert({
        name: body.name,
        description: body.description || '',
        attributes: body.attributes || {},
        is_system: false,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating persona:', error)
      const response: ApiResponse<Persona> = {
        success: false,
        error: error.message
      };
      return NextResponse.json(response, { status: 500 });
    }
    
    const response: ApiResponse<Persona> = {
      success: true,
      data: data
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<Persona> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
