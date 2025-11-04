import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Questionnaire } from '@/types';

// GET /api/questionnaires - List all questionnaires
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get('template_id');
    const status = searchParams.get('status');

    // TODO: Implement database query via BaaS
    const questionnaires: Questionnaire[] = [];

    const response: ApiResponse<Questionnaire[]> = {
      success: true,
      data: questionnaires
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Questionnaire[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/questionnaires - Create a new questionnaire
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate input
    // TODO: Insert into database via BaaS

    const response: ApiResponse<Questionnaire> = {
      success: true,
      data: {
        id: 'temp-id',
        template_id: body.template_id,
        title: body.title,
        description: body.description,
        status: body.status || 'draft',
        start_date: body.start_date,
        end_date: body.end_date,
        created_at: new Date(),
        updated_at: new Date()
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<Questionnaire> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
