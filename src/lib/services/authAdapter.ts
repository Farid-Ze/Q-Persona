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
    constructor(private restUrl: string, private serviceKey: string) { }

    async getUserFromRequest(_reqHeaders: Headers): Promise<AuthUser | null> {
        // Server-side: use existing Supabase SSR helper to read the session cookie
        try {
            const { createClient } = await import('@/lib/supabase/server')
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return null
            return { id: user.id, email: user.email || '', metadata: user.user_metadata || {} }
        } catch {
            return null
        }
    }

    async signIn(_email: string, _password: string): Promise<{ user: AuthUser }> {
        // Implement via Supabase Auth if adopted, for now throw unsupported
        throw new Error('SupabaseAuthAdapter.signIn not implemented')
    }

    async signOut(): Promise<void> {
        // No-op placeholder
    }
}

/**
 * Factory to obtain the default server AuthAdapter
 */
export function getServerAuthAdapter(): AuthAdapter {
    const restUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || ''
    return new SupabaseAuthAdapter(restUrl, serviceKey)
}
