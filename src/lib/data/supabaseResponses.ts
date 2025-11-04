import { ResponsesRepo, Respondent, ResponseAnswer, UUID } from './index'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

export const supabaseResponsesRepo: ResponsesRepo = {
    async list(questionnaire_id: UUID, { limit = 100, offset = 0 } = {}) {
        if (!supabaseUrl || !serviceKey) return []
        const respondentsRes = await fetch(`${supabaseUrl}/rest/v1/respondents?questionnaire_id=eq.${questionnaire_id}&limit=${limit}&offset=${offset}&order=completed_at.desc`, {
            headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
        })
        if (!respondentsRes.ok) return []
        const respondents: Respondent[] = await respondentsRes.json()

        const results = [] as { respondent: Respondent; answers: ResponseAnswer[] }[]
        for (const resp of respondents) {
            const answersRes = await fetch(`${supabaseUrl}/rest/v1/answers?respondent_id=eq.${resp.id}`, {
                headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
            })
            const answers = answersRes.ok ? await answersRes.json() : []
            results.push({ respondent: resp, answers })
        }
        return results
    },
    async create({ questionnaire_id, email, name, metadata, answers }: { questionnaire_id: UUID; email?: string; name?: string; metadata?: any; answers: { question_id: UUID; value: any }[] }) {
        if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase configuration')
        const respondentRes = await fetch(`${supabaseUrl}/rest/v1/respondents`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Prefer': 'return=representation' },
            body: JSON.stringify({ questionnaire_id, email: email || null, name: name || null, metadata: metadata || {}, started_at: new Date().toISOString(), completed_at: new Date().toISOString() })
        })
        if (!respondentRes.ok) throw new Error('Failed to create respondent')
        const respondent = await respondentRes.json()
        const respondent_id = respondent[0].id as UUID

        await Promise.all(answers.map(a => fetch(`${supabaseUrl}/rest/v1/answers`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` },
            body: JSON.stringify({ respondent_id, question_id: a.question_id, value: a.value, created_at: new Date().toISOString() })
        })))

        return { respondent_id }
    }
}
