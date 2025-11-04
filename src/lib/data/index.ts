export type UUID = string

export type Questionnaire = {
    id: UUID
    template_id: UUID
    title: string
    description?: string
    status: 'draft' | 'active' | 'closed'
    workspace_id?: UUID | null
    created_at?: string
}

export interface QuestionnairesRepo {
    list(params: { status?: Questionnaire['status']; limit?: number; offset?: number }): Promise<Questionnaire[]>
    create(input: { template_id: UUID; title: string; description?: string; status?: Questionnaire['status'] }): Promise<Questionnaire>
}

export type ResponseAnswer = { respondent_id: UUID; question_id: UUID; value: any; created_at?: string }
export type Respondent = { id: UUID; questionnaire_id: UUID; email?: string | null; name?: string | null; metadata?: any; started_at?: string; completed_at?: string }

export interface ResponsesRepo {
    list(questionnaire_id: UUID, params?: { limit?: number; offset?: number }): Promise<{ respondent: Respondent; answers: ResponseAnswer[] }[]>
    create(input: { questionnaire_id: UUID; email?: string; name?: string; metadata?: any; answers: { question_id: UUID; value: any }[] }): Promise<{ respondent_id: UUID }>
}
