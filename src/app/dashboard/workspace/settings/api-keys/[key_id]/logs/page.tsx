type PageProps = { params: { key_id: string } }

export default async function ApiKeyLogsPage({ params }: PageProps) {
    const { key_id } = params
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY

    let logs: any[] = []
    if (supabaseUrl && serviceKey) {
        const res = await fetch(
            `${supabaseUrl}/rest/v1/api_request_logs?api_key_id=eq.${key_id}&order=created_at.desc&limit=100`,
            { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }, cache: 'no-store' }
        )
        if (res.ok) {
            logs = await res.json()
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-semibold">API Request Logs</h1>
            <p className="text-gray-600 mb-4">Showing latest 100 requests for API key {key_id}</p>
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-2">Time</th>
                            <th className="text-left p-2">Method</th>
                            <th className="text-left p-2">Path</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Latency</th>
                            <th className="text-left p-2">IP</th>
                            <th className="text-left p-2">User Agent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-t">
                                <td className="p-2 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                                <td className="p-2">{log.method}</td>
                                <td className="p-2">{log.path}</td>
                                <td className="p-2">{log.status}</td>
                                <td className="p-2">{log.latency_ms ?? '-'}</td>
                                <td className="p-2">{log.ip_address}</td>
                                <td className="p-2 max-w-[320px] truncate" title={log.user_agent}>{log.user_agent}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td className="p-4 text-gray-500" colSpan={7}>No logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
