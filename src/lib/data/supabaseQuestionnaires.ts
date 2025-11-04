import { Questionnaire, QuestionnairesRepo, UUID } from './index'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

export const supabaseQuestionnairesRepo: QuestionnairesRepo = {
    async list({ status = 'active', limit = 50, offset = 0 } = {}) {
        if (!supabaseUrl || !serviceKey) return []
        const res = await fetch(`${supabaseUrl}/rest/v1/questionnaires?status=eq.${status}&limit=${limit}&offset=${offset}&order=created_at.desc`, {
            headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
        })
        if (!res.ok) return []
        return res.json()
    },
    async create({ template_id, title, description = '', status = 'draft' }: { template_id: UUID; title: string; description?: string; status?: Questionnaire['status'] }) {
        if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase configuration')
        const res = await fetch(`${supabaseUrl}/rest/v1/questionnaires`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}`, 'Prefer': 'return=representation' },
            body: JSON.stringify({ template_id, title, description, status, created_at: new Date().toISOString() })
        })
        if (!res.ok) throw new Error('Failed to create questionnaire')
        const data = await res.json()
        return data[0]
    }
}
