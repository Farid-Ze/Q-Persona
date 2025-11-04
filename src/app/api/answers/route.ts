import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Answer } from '@/types';

// GET /api/answers - List all answers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const respondentId = searchParams.get('respondent_id');

    // TODO: Implement database query via BaaS
    const answers: Answer[] = [];

    const response: ApiResponse<Answer[]> = {
      success: true,
      data: answers
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Answer[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/answers - Create a new answer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate input
    // TODO: Insert into database via BaaS

    const response: ApiResponse<Answer> = {
      success: true,
      data: {
        id: 'temp-id',
        respondent_id: body.respondent_id,
        question_id: body.question_id,
        value: body.value,
        created_at: new Date()
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<Answer> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
