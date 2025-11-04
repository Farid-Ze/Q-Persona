import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User } from '@/types';

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement database query via BaaS
    const users: User[] = [];
    
    const response: ApiResponse<User[]> = {
      success: true,
      data: users
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<User[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate input
    // TODO: Hash password
    // TODO: Insert into database via BaaS
    
    const response: ApiResponse<User> = {
      success: true,
      data: {
        id: 'temp-id',
        email: body.email,
        name: body.name,
        password_hash: 'hashed',
        created_at: new Date(),
        updated_at: new Date()
      }
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<User> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
