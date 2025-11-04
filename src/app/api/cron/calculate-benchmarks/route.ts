/**
 * Benchmark Calculation Cron Job
 * Recommendation #3: Calculate anonymous benchmark scores nightly
 * This transforms "data" into "intelligence"
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request (in production, use proper auth)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  try {
    // Get all unique benchmark categories
    const categoriesResponse = await fetch(
      `${supabaseUrl}/rest/v1/templates?select=benchmark_category&benchmark_category=not.is.null`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch categories')
    }

    const templates = await categoriesResponse.json()
    const categories = [...new Set(templates.map((t: any) => t.benchmark_category).filter(Boolean))] as string[]

    const today = new Date().toISOString().split('T')[0]
    const results = []

    // Calculate benchmarks for each category
    for (const category of categories) {
      const stats = await calculateBenchmarkForCategory(category, supabaseUrl, serviceKey)

      if (stats) {
        // Store mean
        await storeBenchmarkScore(category, 'mean', stats.mean, stats.count, today, supabaseUrl, serviceKey)
        results.push({ category, type: 'mean', value: stats.mean, sample_size: stats.count })

        // Store median
        await storeBenchmarkScore(category, 'median', stats.median, stats.count, today, supabaseUrl, serviceKey)
        results.push({ category, type: 'median', value: stats.median, sample_size: stats.count })

        // Store percentiles
        await storeBenchmarkScore(category, 'p25', stats.p25, stats.count, today, supabaseUrl, serviceKey)
        await storeBenchmarkScore(category, 'p50', stats.p50, stats.count, today, supabaseUrl, serviceKey)
        await storeBenchmarkScore(category, 'p75', stats.p75, stats.count, today, supabaseUrl, serviceKey)
        await storeBenchmarkScore(category, 'p90', stats.p90, stats.count, today, supabaseUrl, serviceKey)
      }
    }

    return NextResponse.json({
      message: 'Benchmarks calculated successfully',
      categories_processed: categories.length,
      results: results,
    })
  } catch (error) {
    console.error('Error calculating benchmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function calculateBenchmarkForCategory(
  category: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<{ mean: number; median: number; p25: number; p50: number; p75: number; p90: number; count: number } | null> {
  try {
    // Get all templates in this category
    const templatesResponse = await fetch(
      `${supabaseUrl}/rest/v1/templates?benchmark_category=eq.${category}&select=id`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!templatesResponse.ok) {
      return null
    }

    const templates = await templatesResponse.json()
    const templateIds = templates.map((t: any) => t.id)

    if (templateIds.length === 0) {
      return null
    }

    // Get all questionnaires from these templates
    const questionnairesResponse = await fetch(
      `${supabaseUrl}/rest/v1/questionnaires?template_id=in.(${templateIds.join(',')})&select=id`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!questionnairesResponse.ok) {
      return null
    }

    const questionnaires = await questionnairesResponse.json()
    const questionnaireIds = questionnaires.map((q: any) => q.id)

    if (questionnaireIds.length === 0) {
      return null
    }

    // Get all completed respondents
    const respondentsResponse = await fetch(
      `${supabaseUrl}/rest/v1/respondents?questionnaire_id=in.(${questionnaireIds.join(',')})&completed_at=not.is.null&select=id`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!respondentsResponse.ok) {
      return null
    }

    const respondents = await respondentsResponse.json()
    const respondentIds = respondents.map((r: any) => r.id)

    if (respondentIds.length === 0) {
      return null
    }

    // For simplicity, calculate average score across all numeric answers
    // In production, this would be more sophisticated based on question types
    const answersResponse = await fetch(
      `${supabaseUrl}/rest/v1/answers?respondent_id=in.(${respondentIds.join(',')})`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    )

    if (!answersResponse.ok) {
      return null
    }

    const answers = await answersResponse.json()

    // Extract numeric values
    const scores: number[] = []
    for (const answer of answers) {
      const value = answer.value
      if (typeof value === 'number') {
        scores.push(value)
      } else if (typeof value === 'object' && value.score !== undefined) {
        scores.push(parseFloat(value.score))
      }
    }

    if (scores.length === 0) {
      return null
    }

    // Calculate statistics
    scores.sort((a, b) => a - b)
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const median = calculatePercentile(scores, 50)
    const p25 = calculatePercentile(scores, 25)
    const p50 = median
    const p75 = calculatePercentile(scores, 75)
    const p90 = calculatePercentile(scores, 90)

    return {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      p25: Math.round(p25 * 100) / 100,
      p50: Math.round(p50 * 100) / 100,
      p75: Math.round(p75 * 100) / 100,
      p90: Math.round(p90 * 100) / 100,
      count: respondents.length,
    }
  } catch (error) {
    console.error(`Error calculating benchmark for ${category}:`, error)
    return null
  }
}

function calculatePercentile(sortedValues: number[], percentile: number): number {
  const index = (percentile / 100) * (sortedValues.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower

  if (lower === upper) {
    return sortedValues[lower]
  }

  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
}

async function storeBenchmarkScore(
  category: string,
  scoreType: string,
  scoreValue: number,
  sampleSize: number,
  date: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<void> {
  try {
    // Upsert benchmark score
    await fetch(`${supabaseUrl}/rest/v1/benchmark_scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        benchmark_category: category,
        score_type: scoreType,
        score_value: scoreValue,
        sample_size: sampleSize,
        calculation_date: date,
        created_at: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Error storing benchmark score:', error)
  }
}

export const runtime = 'edge'
