"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">We couldn&apos;t load expert submissions.</p>
            <div className="mt-2 flex items-center gap-3">
                <button onClick={reset} className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">Retry</button>
                <a href="/admin/health" className="text-xs text-red-700 hover:text-red-800">Check system health</a>
            </div>
            {process.env.NODE_ENV !== 'production' && (
                <pre className="mt-3 text-xs text-red-700 whitespace-pre-wrap">{error.message}</pre>
            )}
        </div>
    )
}
