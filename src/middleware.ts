import { type NextRequest, NextResponse } from 'next/server'

/**
 * Middleware for auth session management
 * Simplified version that doesn't require Supabase SSR in Edge Runtime
 */
export async function middleware(request: NextRequest) {
  // Simply pass through - auth is handled in Server Components
  // This avoids Edge Runtime compatibility issues with Supabase
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
