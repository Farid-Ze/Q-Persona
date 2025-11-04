export type RealtimeEvent = {
    type: 'insert' | 'update' | 'delete'
    table: string
    payload: Record<string, any>
}

export interface RealtimeAdapter {
    subscribe(channel: string, handler: (evt: RealtimeEvent) => void): { unsubscribe: () => void }
    broadcast(channel: string, event: RealtimeEvent): Promise<void>
}

export class SupabaseRealtimeAdapter implements RealtimeAdapter {
    constructor(private restUrl: string, private serviceKey: string) { }

    subscribe(_channel: string, _handler: (evt: RealtimeEvent) => void) {
        // Placeholder; wire to Supabase Realtime client in future
        return { unsubscribe: () => { } }
    }

    async broadcast(_channel: string, _event: RealtimeEvent): Promise<void> {
        // Placeholder
        return
    }
}
