'use client'

/**
 * ResultsFilters Component
 * Provides filtering and segmentation for results analysis
 * Addresses Issue #6: Advanced analytics for B2B customers
 */

import { useState } from 'react'

interface FilterOption {
  id: string
  label: string
  type: 'date' | 'select' | 'text'
  options?: Array<{ value: string; label: string }>
}

interface ResultsFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void
  totalResponses: number
  filteredResponses: number
}

export function ResultsFilters({
  onFilterChange,
  totalResponses,
  filteredResponses,
}: ResultsFiltersProps) {
  const [filters, setFilters] = useState<Record<string, any>>({
    dateRange: 'all',
    status: 'all',
    searchQuery: '',
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const resetFilters = {
      dateRange: 'all',
      status: 'all',
      searchQuery: '',
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== 'all' && value !== ''
  )

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        {/* Completion Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Completion Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All responses</option>
            <option value="completed">Completed only</option>
            <option value="partial">Partial only</option>
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Responses
          </label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing <span className="font-medium text-gray-900">{filteredResponses}</span> of{' '}
            <span className="font-medium text-gray-900">{totalResponses}</span> responses
          </span>
          {hasActiveFilters && (
            <span className="text-blue-600">
              {totalResponses - filteredResponses} filtered out
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
