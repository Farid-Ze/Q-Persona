import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const internalSecret = process.env.INTERNAL_API_SECRET || process.env.CRON_SECRET
  if (!internalSecret || authHeader !== `Bearer ${internalSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const questionnaireId = body.questionnaire_id as string
    if (!questionnaireId) {
      return NextResponse.json({ error: 'questionnaire_id required' }, { status: 400 })
    }

    // Find template and its benchmark category
    const qRes = await fetch(`${supabaseUrl}/rest/v1/questionnaires?id=eq.${questionnaireId}&select=template_id`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    })
    if (!qRes.ok) throw new Error('Failed to load questionnaire')
    const q = (await qRes.json())[0]
    if (!q) return NextResponse.json({ message: 'No questionnaire found' }, { status: 404 })

    const tRes = await fetch(`${supabaseUrl}/rest/v1/templates?id=eq.${q.template_id}&select=benchmark_category`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    })
    if (!tRes.ok) throw new Error('Failed to load template')
    const t = (await tRes.json())[0]
    const category = t?.benchmark_category
    if (!category) {
      return NextResponse.json({ message: 'Template has no benchmark_category' }, { status: 200 })
    }

    // Get respondents for this questionnaire
    const rRes = await fetch(`${supabaseUrl}/rest/v1/respondents?questionnaire_id=eq.${questionnaireId}&select=id`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    })
    if (!rRes.ok) throw new Error('Failed to load respondents')
    const respondents = await rRes.json()
    if (!respondents.length) return NextResponse.json({ message: 'No respondents yet' }, { status: 200 })

    const respondentIds = respondents.map((r: any) => r.id)

    // Fetch answers for these respondents
    const aRes = await fetch(`${supabaseUrl}/rest/v1/answers?respondent_id=in.(${respondentIds.join(',')})`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    })
    if (!aRes.ok) throw new Error('Failed to load answers')
    const answers = await aRes.json()

    const scores: number[] = []
    for (const answer of answers) {
      const value = answer.value
      if (typeof value === 'number') scores.push(value)
      else if (typeof value === 'object' && value?.score !== undefined) scores.push(parseFloat(value.score))
    }

    if (!scores.length) return NextResponse.json({ message: 'No numeric scores' }, { status: 200 })

    scores.sort((a, b) => a - b)
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length
    const median = percentile(scores, 50)
    const p25 = percentile(scores, 25)
    const p50 = median
    const p75 = percentile(scores, 75)
    const p90 = percentile(scores, 90)

    const today = new Date().toISOString().split('T')[0]

    const upserts = [
      ['mean', mean],
      ['median', median],
      ['p25', p25],
      ['p50', p50],
      ['p75', p75],
      ['p90', p90],
    ] as const

    await Promise.all(upserts.map(([type, value]) => fetch(`${supabaseUrl}/rest/v1/benchmark_scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ benchmark_category: category, score_type: type, score_value: Math.round(value * 100) / 100, sample_size: scores.length, calculation_date: today, created_at: new Date().toISOString() })
    })))

    return NextResponse.json({ message: 'Incremental benchmark updated', category, sample_size: scores.length })
  } catch (error) {
    console.error('Incremental benchmark error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function percentile(sorted: number[], p: number) {
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  const w = idx - lo
  return sorted[lo] * (1 - w) + sorted[hi] * w
}

export const runtime = 'edge'
