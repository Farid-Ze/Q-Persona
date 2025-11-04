export type FeatureKey = 'api' | 'audit_logs' | 'sso' | 'scim' | 'data_residency' | 'custom_roles'

/**
 * Lightweight plan → feature gating helper using PostgREST
 * - Reads the user's active subscription plan
 * - Checks plan_feature_flags for the given feature
 */
export async function hasFeatureForUser(userId: string, feature: FeatureKey): Promise<boolean> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY
    if (!supabaseUrl || !serviceKey) {
        // In non-configured envs, be permissive for local dev
        return true
    }

    // Find most recent active subscription
    const subRes = await fetch(
        `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&status=eq.active&order=created_at.desc&limit=1`,
        { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }, cache: 'no-store' }
    )
    if (!subRes.ok) return false
    const subs = await subRes.json()
    const planType: string | undefined = subs?.[0]?.plan_type
    if (!planType) return false

    // Check plan_feature_flags
    const flagRes = await fetch(
        `${supabaseUrl}/rest/v1/plan_feature_flags?plan_type=eq.${planType}&feature_key=eq.${feature}&enabled=is.true&select=feature_key`,
        { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }, cache: 'no-store' }
    )
    if (!flagRes.ok) return false
    const flags = await flagRes.json()
    return Array.isArray(flags) && flags.length > 0
}

/**
 * Optional: get a subscription-level data region hint
 */
export async function getUserDataRegion(userId: string): Promise<'us' | 'eu' | 'apac' | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY
    if (!supabaseUrl || !serviceKey) return null

    const subRes = await fetch(
        `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&status=eq.active&order=created_at.desc&limit=1&select=data_region`,
        { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }, cache: 'no-store' }
    )
    if (!subRes.ok) return null
    const subs = await subRes.json()
    return subs?.[0]?.data_region ?? null
}
