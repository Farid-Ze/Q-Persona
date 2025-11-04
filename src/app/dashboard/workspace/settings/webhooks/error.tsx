"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 012 0v6a1 1 0 11-2 0V5zm1 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">We couldn&apos;t load your webhooks</p>
                    <p className="text-xs text-red-700 mt-1">Please try again. If the problem persists, contact support.</p>
                    <div className="mt-3">
                        <button onClick={reset} className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">Retry</button>
                    </div>
                    {process.env.NODE_ENV !== 'production' && (
                        <pre className="mt-3 text-xs text-red-700 whitespace-pre-wrap">{error.message}</pre>
                    )}
                </div>
            </div>
        </div>
    )
}
