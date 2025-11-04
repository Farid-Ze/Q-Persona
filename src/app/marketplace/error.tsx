"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading marketplace</h2>
                <p className="text-sm text-gray-600 mb-4">Please try again in a moment.</p>
                <button onClick={reset} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Retry</button>
                {process.env.NODE_ENV !== 'production' && (
                    <pre className="mt-4 text-xs text-red-600 whitespace-pre-wrap">{error.message}</pre>
                )}
            </div>
        </div>
    )
}
