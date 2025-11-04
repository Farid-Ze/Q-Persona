/**
 * Template Marketplace - Public template discovery
 * Allows users to browse, search, and download expert-created templates
 */

import Link from 'next/link'

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string }
}) {
  const category = searchParams.category || 'all'
  const search = searchParams.search || ''
  const sort = searchParams.sort || 'popular'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Q-Persona Marketplace</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/experts/submit"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Submit Template
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Expert-Validated Survey Templates
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover professional questionnaires created by industry experts
          </p>

          {/* Search Bar */}
          <form className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search templates..."
                className="flex-1 rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-50"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-64 flex-shrink-0">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
              <CategoryList currentCategory={category} />
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>
              <FilterList />
            </div>
          </aside>

          {/* Main Content - Templates Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category === 'all' ? 'All Templates' : category}
                </h3>
                <p className="text-sm text-gray-600">
                  <TemplateCount category={category} search={search} />
                </p>
              </div>

              <SortDropdown currentSort={sort} />
            </div>

            <TemplateGrid category={category} search={search} sort={sort} />
          </main>
        </div>
      </div>
    </div>
  )
}

function CategoryList({ currentCategory }: { currentCategory: string }) {
  const categories = [
    { id: 'all', name: 'All Templates', count: 156 },
    { id: 'hr', name: 'Human Resources', count: 42 },
    { id: 'research', name: 'Academic Research', count: 38 },
    { id: 'marketing', name: 'Marketing & Sales', count: 28 },
    { id: 'customer', name: 'Customer Feedback', count: 24 },
    { id: 'employee', name: 'Employee Satisfaction', count: 18 },
    { id: 'healthcare', name: 'Healthcare', count: 6 },
  ]

  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={`/marketplace?category=${cat.id}`}
            className={`block rounded-md px-3 py-2 text-sm ${currentCategory === cat.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center justify-between">
              <span>{cat.name}</span>
              <span className="text-xs text-gray-500">{cat.count}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function FilterList() {
  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center text-sm">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
          <span className="text-gray-700">Free only</span>
        </label>
      </div>
      <div>
        <label className="flex items-center text-sm">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
          <span className="text-gray-700">Verified experts</span>
        </label>
      </div>
      <div>
        <label className="flex items-center text-sm">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
          <span className="text-gray-700">Featured</span>
        </label>
      </div>
      <div>
        <label className="flex items-center text-sm">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
          <span className="text-gray-700">High rated (4+)</span>
        </label>
      </div>
    </div>
  )
}

function SortDropdown({ currentSort }: { currentSort: string }) {
  return (
    <select
      name="sort"
      defaultValue={currentSort}
      className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="popular">Most Popular</option>
      <option value="newest">Newest First</option>
      <option value="rating">Highest Rated</option>
      <option value="downloads">Most Downloads</option>
    </select>
  )
}

async function TemplateCount({ category, search }: { category: string; search: string }) {
  // TODO: Fetch actual count from database
  const count = 156
  return <>{count} templates found</>
}

async function TemplateGrid({ category, search, sort }: { category: string; search: string; sort: string }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Database not configured</p>
      </div>
    )
  }

  // TODO: Implement actual database query with filters
  // For now, show placeholder templates
  const templates = getMockTemplates()

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No templates found</p>
        <Link
          href="/experts/submit"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          Be the first to contribute a template →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}

function TemplateCard({ template }: { template: any }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition">
      {/* Preview Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <svg className="w-16 h-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900">
            {template.name}
          </h4>
          {template.is_verified && (
            <span className="flex-shrink-0 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              ✓ Verified
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{template.rating}</span>
            <span className="text-gray-500">({template.reviews})</span>
          </div>
          <div className="text-gray-500">
            {template.downloads} downloads
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            by <span className="font-medium">{template.expert}</span>
          </div>
          <Link
            href={`/marketplace/${template.id}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </Link>
        </div>
      </div>
    </div>
  )
}

function getMockTemplates() {
  return [
    {
      id: '1',
      name: 'Employee Satisfaction Survey',
      description: 'Comprehensive annual employee satisfaction questionnaire with 40+ questions',
      is_verified: true,
      rating: 4.8,
      reviews: 124,
      downloads: 1520,
      expert: 'Dr. Sarah Johnson',
      price: 0,
    },
    {
      id: '2',
      name: 'Customer Feedback - SaaS',
      description: 'Product feedback template designed for SaaS companies',
      is_verified: true,
      rating: 4.9,
      reviews: 89,
      downloads: 980,
      expert: 'Prof. Michael Chen',
      price: 0,
    },
    {
      id: '3',
      name: 'Market Research Survey',
      description: 'Professional market research questionnaire template',
      is_verified: false,
      rating: 4.5,
      reviews: 45,
      downloads: 520,
      expert: 'Linda Martinez',
      price: 0,
    },
    {
      id: '4',
      name: 'Healthcare Patient Experience',
      description: 'Patient satisfaction survey for healthcare facilities',
      is_verified: true,
      rating: 4.7,
      reviews: 78,
      downloads: 650,
      expert: 'Dr. James Wilson',
      price: 0,
    },
    {
      id: '5',
      name: 'University Course Evaluation',
      description: 'Standard course evaluation template for higher education',
      is_verified: true,
      rating: 4.6,
      reviews: 156,
      downloads: 2100,
      expert: 'Prof. Emma Davis',
      price: 0,
    },
    {
      id: '6',
      name: 'Product Usability Testing',
      description: 'UX research template for product testing and feedback',
      is_verified: false,
      rating: 4.4,
      reviews: 34,
      downloads: 410,
      expert: 'Alex Thompson',
      price: 0,
    },
  ]
}
