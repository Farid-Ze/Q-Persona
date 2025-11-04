export default function ApiDocsPage() {
    return (
        <div className="w-full h-[calc(100vh-4rem)]">
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-2">Q-Persona API Docs</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Below is an interactive Swagger UI embedding the OpenAPI spec. You can also fetch the raw spec at <code>/openapi.yaml</code>.
                </p>
            </div>
            <iframe
                title="Swagger UI"
                src={`https://petstore.swagger.io/?url=${encodeURIComponent('/openapi.yaml')}`}
                className="w-full h-full border-0"
            />
        </div>
    )
}
