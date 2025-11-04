/**
 * Expert Profile Page
 * Recommendation #4: Public expert profiles with social proof
 * Shows expert's templates, ratings, and download counts
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Database Configuration Error</p>
          <p className="text-sm text-gray-600 mt-2">
            Missing environment variables: {!supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL'} {!serviceKey && 'SUPABASE_SERVICE_KEY'}
          </p>
        </div>
      </div>
    )
  }
  
  try {
    // Fetch expert profile
    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/expert_profiles?username=eq.${username}`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    )
    
    if (!profileResponse.ok) {
      notFound()
    }
    
    const profiles = await profileResponse.json()
    
    if (profiles.length === 0) {
      notFound()
    }
    
    const expert = profiles[0]
    
    // Fetch expert's templates
    const templatesResponse = await fetch(
      `${supabaseUrl}/rest/v1/marketplace_templates?expert_profile_id=eq.${expert.id}&is_public=eq.true&order=download_count.desc`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    )
    
    const marketplaceTemplates = templatesResponse.ok ? await templatesResponse.json() : []
    
    // Fetch actual template details
    const templates = await Promise.all(
      marketplaceTemplates.map(async (mt: any) => {
        const templateResponse = await fetch(
          `${supabaseUrl}/rest/v1/templates?id=eq.${mt.template_id}`,
          {
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
            },
          }
        )
        
        const templateData = templateResponse.ok ? await templateResponse.json() : []
        
        return {
          ...mt,
          template: templateData[0] || null,
        }
      })
    )
    
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    Q-Persona
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/marketplace"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Marketplace
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Expert Header */}
          <div className="mb-12">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {expert.avatar_url ? (
                  <img
                    src={expert.avatar_url}
                    alt={expert.display_name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {expert.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Expert Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {expert.display_name}
                  </h1>
                  {expert.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified Expert
                    </span>
                  )}
                </div>
                
                {expert.affiliation && (
                  <p className="text-lg text-gray-600 mb-3">{expert.affiliation}</p>
                )}
                
                {expert.bio && (
                  <p className="text-gray-700 mb-4 max-w-3xl">{expert.bio}</p>
                )}
                
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{expert.total_templates}</span>
                    <span className="text-gray-600">Templates</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="font-semibold text-gray-900">{expert.total_downloads.toLocaleString()}</span>
                    <span className="text-gray-600">Downloads</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{expert.average_rating.toFixed(1)}</span>
                    <span className="text-gray-600">Average Rating</span>
                  </div>
                </div>
                
                {expert.website_url && (
                  <a
                    href={expert.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {expert.website_url}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Templates Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Templates by {expert.display_name}
            </h2>
            
            {templates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No public templates yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((item) => (
                  <TemplateCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading expert profile:', error)
    return <div>Error loading profile</div>
  }
}

function TemplateCard({ item }: { item: any }) {
  const template = item.template
  
  if (!template) {
    return null
  }
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition">
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <svg className="w-16 h-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {template.name}
          </h3>
          {item.is_verified && (
            <span className="flex-shrink-0 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              ✓
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{item.rating_average.toFixed(1)}</span>
            <span className="text-gray-500">({item.rating_count})</span>
          </div>
          <div className="text-gray-500">
            {item.download_count} downloads
          </div>
        </div>
        
        <Link
          href={`/marketplace/${item.template_id}`}
          className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
        >
          View Template
        </Link>
      </div>
    </div>
  )
}
