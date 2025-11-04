'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Persona } from '@/types'
import { trackEvent } from '@/lib/analytics/client'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'

export default function OnboardingPage() {
  const router = useRouter()
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersonas, setSelectedPersonas] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.ONBOARDING_STARTED)
    fetchPersonas()
  }, [])

  async function fetchPersonas() {
    try {
      const response = await fetch('/api/personas')
      const data = await response.json()
      
      if (data.success) {
        // Filter only system personas for onboarding
        const systemPersonas = data.data.filter((p: Persona) => p.is_system)
        setPersonas(systemPersonas)
      }
    } catch (error) {
      console.error('Error fetching personas:', error)
    } finally {
      setLoading(false)
    }
  }

  function togglePersona(personaId: string) {
    const newSelected = new Set(selectedPersonas)
    if (newSelected.has(personaId)) {
      newSelected.delete(personaId)
    } else {
      newSelected.add(personaId)
    }
    setSelectedPersonas(newSelected)
  }

  async function handleComplete() {
    if (selectedPersonas.size === 0) {
      // TODO: Replace with proper toast notification component
      alert('Silakan pilih minimal satu persona')
      return
    }

    setSaving(true)

    try {
      // Save selected personas
      const response = await fetch('/api/user-personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona_ids: Array.from(selectedPersonas),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Track completion
        trackEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETED, {
          personas_count: selectedPersonas.size,
          persona_ids: Array.from(selectedPersonas),
        })

        // Track each selected persona
        personas
          .filter(p => selectedPersonas.has(p.id))
          .forEach(persona => {
            trackEvent(ANALYTICS_EVENTS.PERSONA_SELECTED, {
              persona_id: persona.id,
              persona_name: persona.name,
            })
          })

        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        // TODO: Replace with proper error UI component
        alert('Terjadi kesalahan: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving personas:', error)
      // TODO: Replace with proper error UI component
      alert('Terjadi kesalahan saat menyimpan persona')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selamat Datang di Q-Persona! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Untuk memberikan pengalaman terbaik, pilih persona yang sesuai dengan Anda
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Pilih satu atau lebih persona yang menggambarkan kebutuhan Anda
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {personas.map((persona) => {
            const isSelected = selectedPersonas.has(persona.id)
            return (
              <div
                key={persona.id}
                onClick={() => togglePersona(persona.id)}
                className={`
                  relative cursor-pointer rounded-lg border-2 p-6 transition-all
                  ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {persona.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {persona.description}
                </p>

                {persona.attributes?.features && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Fitur yang cocok:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(persona.attributes.features as string[]).slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Kembali
          </button>

          <button
            onClick={handleComplete}
            disabled={saving || selectedPersonas.size === 0}
            className={`
              px-6 py-3 rounded-lg font-medium text-white transition-colors
              ${
                saving || selectedPersonas.size === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {saving ? 'Menyimpan...' : `Lanjutkan (${selectedPersonas.size} dipilih)`}
          </button>
        </div>
      </div>
    </div>
  )
}
