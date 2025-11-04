import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Template } from '@/types';

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personaId = searchParams.get('persona_id');
    
    // TODO: Implement database query via BaaS
    const templates: Template[] = [];
    
    const response: ApiResponse<Template[]> = {
      success: true,
      data: templates
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Template[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate input
    // TODO: Insert into database via BaaS
    
    const response: ApiResponse<Template> = {
      success: true,
      data: {
        id: 'temp-id',
        persona_id: body.persona_id,
        workspace_id: body.workspace_id,
        name: body.name,
        description: body.description,
        questions: body.questions || [],
        is_global: false,
        validated_by_expert_id: body.validated_by_expert_id,
        validation_date: body.validation_date,
        created_at: new Date(),
        updated_at: new Date()
      }
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<Template> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
