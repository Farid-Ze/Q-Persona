/**
 * Expert Template Submission Portal (Recommendation #4)
 * Allows experts to contribute templates to the platform
 */

import Link from 'next/link'

export default function ExpertSubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Q-Persona Expert Portal</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Contribute Your Expertise
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Share your validated questionnaire templates with the Q-Persona community
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <ExpertSubmissionForm />
        </div>
        
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900">
            Why contribute?
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Expand your professional reach and credibility
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Help students and researchers with quality templates
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Get attribution for your work with expert badges
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Future revenue sharing opportunities
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

function ExpertSubmissionForm() {
  return (
    <form action={submitTemplate} className="space-y-6">
      <div>
        <label htmlFor="expertName" className="block text-sm font-medium text-gray-700">
          Your Name *
        </label>
        <input
          type="text"
          id="expertName"
          name="expertName"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Dr. Jane Smith"
        />
      </div>
      
      <div>
        <label htmlFor="expertEmail" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          id="expertEmail"
          name="expertEmail"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="jane.smith@university.edu"
        />
      </div>
      
      <div>
        <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
          Affiliation (Optional)
        </label>
        <input
          type="text"
          id="affiliation"
          name="affiliation"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="University of Indonesia, Department of Psychology"
        />
      </div>
      
      <div>
        <label htmlFor="templateName" className="block text-sm font-medium text-gray-700">
          Template Name *
        </label>
        <input
          type="text"
          id="templateName"
          name="templateName"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="e.g., Employee Satisfaction Survey"
        />
      </div>
      
      <div>
        <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="templateDescription"
          name="templateDescription"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Describe the purpose and target audience of this template..."
        />
      </div>
      
      <div>
        <label htmlFor="templateQuestions" className="block text-sm font-medium text-gray-700">
          Questions (JSON Format) *
        </label>
        <textarea
          id="templateQuestions"
          name="templateQuestions"
          required
          rows={10}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder={`[\n  {\n    "id": "q1",\n    "text": "How satisfied are you?",\n    "type": "rating",\n    "required": true,\n    "order": 1\n  }\n]`}
        />
        <p className="mt-1 text-xs text-gray-500">
          Provide questions in JSON format. Each question should have: id, text, type, required, and order.
        </p>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          required
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
          I agree that this template can be reviewed and published on the platform *
        </label>
      </div>
      
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit Template for Review
      </button>
    </form>
  )
}

async function submitTemplate(formData: FormData) {
  'use server'
  
  const expertName = formData.get('expertName') as string
  const expertEmail = formData.get('expertEmail') as string
  const affiliation = formData.get('affiliation') as string
  const templateName = formData.get('templateName') as string
  const templateDescription = formData.get('templateDescription') as string
  const templateQuestionsStr = formData.get('templateQuestions') as string
  
  // Validate and parse JSON
  let templateQuestions
  try {
    templateQuestions = JSON.parse(templateQuestionsStr)
  } catch (error) {
    console.error('Invalid JSON:', error)
    return
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    console.error('Database not configured')
    return
  }
  
  // Insert into expert_submissions table
  try {
    await fetch(`${supabaseUrl}/rest/v1/expert_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        expert_email: expertEmail,
        expert_name: expertName,
        template_name: templateName,
        template_description: templateDescription,
        template_questions: templateQuestions,
        status: 'pending',
        created_at: new Date().toISOString(),
      }),
    })
    
    console.log('Template submitted successfully')
    // TODO: Redirect to success page or show success message
  } catch (error) {
    console.error('Failed to submit template:', error)
  }
}
