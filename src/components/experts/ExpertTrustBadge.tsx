'use client'

/**
 * ExpertTrustBadge Component
 * Displays expert validation badge on templates
 * Addresses Issue #2: Make expert validation a technical feature, not just a marketing claim
 */

import { useState } from 'react'
import Image from 'next/image'
import { Expert } from '@/types'

interface ExpertTrustBadgeProps {
  expert: Expert
  validationDate?: Date
  size?: 'sm' | 'md' | 'lg'
}

export function ExpertTrustBadge({
  expert,
  validationDate,
  size = 'md'
}: ExpertTrustBadgeProps) {
  const [showModal, setShowModal] = useState(false)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium hover:bg-green-100 transition ${sizeClasses[size]}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Divalidasi oleh Ahli</span>
      </button>

      {/* Expert Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Validasi Ahli
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {expert.photo_url && (
                <Image
                  src={expert.photo_url}
                  alt={expert.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              )}

              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900">{expert.name}</h4>
                {expert.title && (
                  <p className="text-sm text-gray-600">{expert.title}</p>
                )}
                {expert.affiliation && (
                  <p className="text-sm text-gray-500">{expert.affiliation}</p>
                )}
              </div>

              {expert.bio && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-700">{expert.bio}</p>
                </div>
              )}

              {validationDate && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Divalidasi pada: {new Date(validationDate).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Templat ini telah divalidasi oleh ahli</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
