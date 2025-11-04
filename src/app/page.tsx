export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Q-Persona</h1>
        <p className="mb-4">Lean Service-Based Architecture</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Manage user accounts and authentication</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Personas</h2>
            <p className="text-gray-600">Create and manage user personas</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Templates</h2>
            <p className="text-gray-600">Design questionnaire templates</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Questionnaires</h2>
            <p className="text-gray-600">Create and deploy questionnaires</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Respondents</h2>
            <p className="text-gray-600">Manage survey respondents</p>
          </div>
          
          <div className="border rounded-lg p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Answers</h2>
            <p className="text-gray-600">Collect and analyze responses</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Architecture Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Next.js Frontend (React with SSR/SSG)</li>
            <li>Backend as a Service (BaaS) approach</li>
            <li>Serverless Functions for custom logic</li>
            <li>PostgreSQL Database</li>
            <li>Modern authentication system</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
