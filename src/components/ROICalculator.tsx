'use client'

import { useState } from 'react'

export default function ROICalculator() {
  const [users, setUsers] = useState(100)
  const [responsesPerMonth, setResponsesPerMonth] = useState(1000)
  const [currentTool, setCurrentTool] = useState('none')

  // Calculate costs and savings
  const calculateROI = () => {
    // Non-compliance costs (annual)
    const regulatoryFines = 250000000 // Rp 250M average
    const auditRemediation = 200000000 // Rp 200M
    const manualLogReconstruction = 100000000 // Rp 100M
    const totalNonComplianceCost = regulatoryFines + auditRemediation + manualLogReconstruction

    // Q-Persona Enterprise cost
    const qPersonaAnnualCost = 140000000 // Rp 140M ($10,000/year at 14,000 IDR/USD)

    // Current tool costs (annual estimate)
    const currentToolCosts = {
      'none': 0,
      'googleforms': 0,
      'surveymonkey': 350000000, // ~$25K/year
      'typeform': 168000000, // ~$12K/year
      'qualtrics': 700000000 // ~$50K/year
    }

    // Calculate savings
    const currentToolCost = currentToolCosts[currentTool as keyof typeof currentToolCosts] || 0
    const complianceSavings = totalNonComplianceCost * 0.9 // Assume 90% risk reduction
    const toolCostSavings = currentToolCost > qPersonaAnnualCost ? currentToolCost - qPersonaAnnualCost : 0
    const totalSavings = complianceSavings + toolCostSavings
    const netSavings = totalSavings - qPersonaAnnualCost
    const roi = ((netSavings / qPersonaAnnualCost) * 100).toFixed(0)

    // Determine recommended tier
    let recommendedTier = 'Enterprise'
    if (users <= 10 && responsesPerMonth <= 100) {
      recommendedTier = 'Free'
    } else if (users <= 50 && responsesPerMonth <= 5000) {
      recommendedTier = 'Pro'
    } else if (users <= 200 && responsesPerMonth <= 50000) {
      recommendedTier = 'Business'
    }

    return {
      totalNonComplianceCost,
      qPersonaAnnualCost,
      totalSavings,
      netSavings,
      roi: parseInt(roi),
      recommendedTier,
      currentToolCost,
      complianceSavings,
      toolCostSavings
    }
  }

  const results = calculateROI()

  // Format currency (Indonesian Rupiah)
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format as millions
  const formatMillions = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(0)}M`
  }

  return (
    <div id="calculator" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise ROI Calculator
          </h2>
          <p className="text-xl text-gray-600">
            Calculate your return on investment with Q-Persona
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Input Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Organization</h3>

            <div className="space-y-6">
              {/* Number of Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Users
                </label>
                <input
                  type="number"
                  min="1"
                  value={users}
                  onChange={(e) => setUsers(parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                />
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={users}
                  onChange={(e) => setUsers(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              {/* Responses per Month */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responses per Month
                </label>
                <input
                  type="number"
                  min="0"
                  value={responsesPerMonth}
                  onChange={(e) => setResponsesPerMonth(parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={responsesPerMonth}
                  onChange={(e) => setResponsesPerMonth(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              {/* Current Tool */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Survey Tool
                </label>
                <select
                  value={currentTool}
                  onChange={(e) => setCurrentTool(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                >
                  <option value="none">No current tool / Google Forms</option>
                  <option value="surveymonkey">SurveyMonkey Enterprise</option>
                  <option value="typeform">Typeform Business</option>
                  <option value="qualtrics">Qualtrics</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your ROI Analysis</h3>

            <div className="space-y-6">
              {/* Recommended Tier */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Recommended Tier</div>
                <div className="text-2xl font-bold text-blue-600">{results.recommendedTier}</div>
              </div>

              {/* Annual Investment */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Annual Investment</div>
                <div className="text-2xl font-bold text-gray-900">{formatMillions(results.qPersonaAnnualCost)}</div>
              </div>

              {/* Total Savings */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Total Annual Savings</div>
                <div className="text-2xl font-bold text-green-600">{formatMillions(results.totalSavings)}</div>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <div>• Compliance risk reduction: {formatMillions(results.complianceSavings)}</div>
                  {results.toolCostSavings > 0 && (
                    <div>• Tool cost savings: {formatMillions(results.toolCostSavings)}</div>
                  )}
                </div>
              </div>

              {/* Net Savings */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Net Annual Savings</div>
                <div className="text-2xl font-bold text-green-600">{formatMillions(results.netSavings)}</div>
              </div>

              {/* ROI Percentage */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 shadow-lg text-white">
                <div className="text-sm mb-1">Return on Investment</div>
                <div className="text-5xl font-bold">{results.roi}%</div>
                <div className="text-sm mt-2 opacity-90">
                  Payback period: {results.roi > 0 ? '< 1 month' : 'N/A'}
                </div>
              </div>

              {/* Risk Avoided */}
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-yellow-500">
                <div className="text-sm text-gray-600 mb-1">Compliance Risks Avoided</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>✓ Regulatory fines: {formatMillions(250000000)}</div>
                  <div>✓ Audit remediation: {formatMillions(200000000)}</div>
                  <div>✓ Manual log work: {formatMillions(100000000)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ready to start saving and ensure compliance?
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#demo"
              className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700 shadow-lg"
            >
              Schedule Enterprise Demo
            </a>
            <a
              href="/auth/signup?plan=business"
              className="rounded-md border-2 border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-900 hover:border-gray-400"
            >
              Start Free Trial
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            * ROI calculations based on industry averages for regulated industries in Indonesia
          </p>
        </div>
      </div>
    </div>
  )
}
