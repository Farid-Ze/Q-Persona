type Region = 'us' | 'eu' | 'apac'

export type RegionalClientConfig = {
    baseUrl: string
    serviceKey: string
}

const defaultConfig: RegionalClientConfig | null = ((): RegionalClientConfig | null => {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY
    return baseUrl && serviceKey ? { baseUrl, serviceKey } : null
})()

function envFor(region: Region): RegionalClientConfig | null {
    const url = process.env[`SUPABASE_URL_${region.toUpperCase()}` as const]
    const key = process.env[`SUPABASE_SERVICE_KEY_${region.toUpperCase()}` as const]
    if (url && key) return { baseUrl: url, serviceKey: key }
    return null
}

export function getRegionalConfig(region: Region | null | undefined): RegionalClientConfig | null {
    if (region) {
        const cfg = envFor(region)
        if (cfg) return cfg
    }
    return defaultConfig
}

/**
 * Resolve region for a user and return regional Supabase REST config.
 * If no region is configured, returns the default config.
 */
export async function getUserRegionalConfig(userId: string): Promise<RegionalClientConfig | null> {
    try {
        const { getUserDataRegion } = await import('@/lib/billing/features')
        const region = await getUserDataRegion(userId)
        return getRegionalConfig(region)
    } catch {
        return defaultConfig
    }
}
