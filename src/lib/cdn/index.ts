/**
 * CDN Integration Library
 * Provides functions for uploading and managing assets via CDN
 * Supports Cloudflare R2, AWS S3, or similar object storage
 */

export interface UploadOptions {
  file: File | Buffer;
  key?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  workspaceId?: string;
  userId?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  cdnUrl?: string;
  key?: string;
  error?: string;
}

/**
 * Upload asset to CDN
 * In production, this would integrate with Cloudflare R2, AWS S3, or similar
 */
export async function uploadAsset(options: UploadOptions): Promise<UploadResult> {
  // For now, return mock result
  // TODO: Implement actual CDN upload

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return {
      success: false,
      error: 'CDN not configured',
    };
  }

  try {
    // Generate unique key if not provided
    const key = options.key || `uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In production, upload to actual CDN
    // For now, log the upload and track in database

    const cdnUrl = `https://cdn.q-persona.com/${key}`;

    // Track asset in database
    await trackAsset({
      asset_key: key,
      asset_type: getAssetType(options.contentType || ''),
      cdn_url: cdnUrl,
      uploaded_by: options.userId,
      workspace_id: options.workspaceId,
      metadata: options.metadata || {},
    });

    return {
      success: true,
      url: cdnUrl,
      cdnUrl: cdnUrl,
      key: key,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Track uploaded asset in database
 */
async function trackAsset(asset: {
  asset_key: string;
  asset_type: string;
  cdn_url?: string;
  uploaded_by?: string;
  workspace_id?: string;
  metadata: Record<string, any>;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/cdn_assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        ...asset,
        created_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to track asset:', error);
  }
}

/**
 * Get asset type from content type
 */
function getAssetType(contentType: string): 'image' | 'video' | 'document' | 'template_export' {
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.includes('pdf') || contentType.includes('document')) return 'document';
  return 'template_export';
}

/**
 * Generate optimized image URL with Cloudflare Image Resizing
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string {
  // If using Cloudflare, use their image transformation
  // https://developers.cloudflare.com/images/image-resizing/

  const {
    width = 800,
    height,
    quality = 85,
    format = 'auto',
  } = options;

  // For local/dev, return original URL
  if (!url.includes('cdn.q-persona.com')) {
    return url;
  }

  // Build Cloudflare image transformation URL
  const params = new URLSearchParams();
  params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  params.set('quality', quality.toString());
  params.set('format', format);

  return `https://cdn.q-persona.com/cdn-cgi/image/${params.toString()}/${url.replace('https://cdn.q-persona.com/', '')}`;
}

/**
 * Get CDN URL for static asset with cache busting
 */
export function getCDNUrl(path: string, version?: string): string {
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.q-persona.com';
  const v = version || process.env.NEXT_PUBLIC_APP_VERSION || 'latest';

  return `https://${cdnDomain}${path}?v=${v}`;
}

/**
 * Purge CDN cache for specific URLs
 * This would integrate with Cloudflare API or similar
 */
export async function purgeCDNCache(urls: string[]): Promise<boolean> {
  const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
  const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!cloudflareZoneId || !cloudflareApiToken) {
    console.warn('Cloudflare not configured, skipping cache purge');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: urls }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to purge CDN cache:', error);
    return false;
  }
}

/**
 * Get CDN analytics and bandwidth usage
 */
export async function getCDNAnalytics(
  startDate: Date,
  endDate: Date
): Promise<{
  bandwidth: number;
  requests: number;
  cachedRequests: number;
  cacheHitRatio: number;
}> {
  // TODO: Implement with actual CDN provider API
  // For now, return mock data

  return {
    bandwidth: 1024 * 1024 * 500, // 500 MB
    requests: 10000,
    cachedRequests: 9500,
    cacheHitRatio: 0.95, // 95%
  };
}

/**
 * Configure CDN settings
 */
export interface CDNConfig {
  enabled: boolean;
  domain: string;
  provider: 'cloudflare' | 'aws-cloudfront' | 'vercel' | 'custom';
  caching: {
    browserTTL: number; // seconds
    edgeTTL: number; // seconds
  };
  imageOptimization: {
    enabled: boolean;
    formats: string[];
    qualities: number[];
  };
  security: {
    hotlinkProtection: boolean;
    allowedDomains: string[];
  };
}

/**
 * Get current CDN configuration
 */
export function getCDNConfig(): CDNConfig {
  return {
    enabled: true,
    domain: process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.q-persona.com',
    provider: 'cloudflare',
    caching: {
      browserTTL: 31536000, // 1 year
      edgeTTL: 2592000, // 30 days
    },
    imageOptimization: {
      enabled: true,
      formats: ['webp', 'avif', 'auto'],
      qualities: [85, 90, 95],
    },
    security: {
      hotlinkProtection: true,
      allowedDomains: ['q-persona.com', '*.q-persona.com'],
    },
  };
}
