"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-sm text-gray-600 mb-4">We couldn&apos;t load this expert profile.</p>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={reset} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Try again</button>
                    <a href="/marketplace" className="text-sm text-blue-600 hover:text-blue-700">Go to Marketplace</a>
                </div>
                {process.env.NODE_ENV !== 'production' && (
                    <pre className="mt-4 text-xs text-red-600 whitespace-pre-wrap">{error.message}</pre>
                )}
            </div>
        </div>
    )
}
