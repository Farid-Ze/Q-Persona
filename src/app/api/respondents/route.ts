import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Respondent } from '@/types';

// GET /api/respondents - List all respondents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const questionnaireId = searchParams.get('questionnaire_id');

    // TODO: Implement database query via BaaS
    const respondents: Respondent[] = [];

    const response: ApiResponse<Respondent[]> = {
      success: true,
      data: respondents
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Respondent[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/respondents - Create a new respondent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate input
    // TODO: Insert into database via BaaS

    const response: ApiResponse<Respondent> = {
      success: true,
      data: {
        id: 'temp-id',
        questionnaire_id: body.questionnaire_id,
        email: body.email,
        name: body.name,
        metadata: body.metadata || {},
        started_at: new Date(),
        completed_at: body.completed_at
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<Respondent> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
