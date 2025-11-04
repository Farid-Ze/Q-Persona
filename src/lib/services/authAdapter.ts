export interface AuthUser {
  id: string
  email: string
  metadata?: Record<string, any>
}

export interface AuthAdapter {
  getUserFromRequest(reqHeaders: Headers): Promise<AuthUser | null>
  signIn(email: string, password: string): Promise<{ user: AuthUser }>
  signOut(): Promise<void>
}

export class SupabaseAuthAdapter implements AuthAdapter {
  constructor(private restUrl: string, private serviceKey: string) {}

  async getUserFromRequest(_reqHeaders: Headers): Promise<AuthUser | null> {
    // Placeholder: integrate with Supabase auth session verification if needed
    return null
  }

  async signIn(_email: string, _password: string): Promise<{ user: AuthUser }> {
    // Implement via Supabase Auth if adopted, for now throw unsupported
    throw new Error('SupabaseAuthAdapter.signIn not implemented')
  }

  async signOut(): Promise<void> {
    // No-op placeholder
  }
}
