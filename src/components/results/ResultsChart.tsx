'use client'

/**
 * ResultsChart Component
 * Displays different chart types for questionnaire results
 * Addresses Issue #6: Results Dashboard for delivering insights
 */

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ResultsChartProps {
  questionText: string
  questionType: 'multiple_choice' | 'rating' | 'boolean' | 'text'
  data: Array<{ label: string; value: number; percentage?: number }>
  chartType?: 'bar' | 'pie' | 'line'
}

const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#F97316', // orange-500
]

export function ResultsChart({
  questionText,
  questionType,
  data,
  chartType = 'bar',
}: ResultsChartProps) {
  const totalResponses = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0)
  }, [data])

  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      percentage: totalResponses > 0 ? ((item.value / totalResponses) * 100).toFixed(1) : 0,
    }))
  }, [data, totalResponses])

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="bg-white p-3 border rounded shadow-lg">
                  <p className="font-medium">{data.label}</p>
                  <p className="text-sm text-gray-600">
                    Responses: {data.value} ({data.percentage}%)
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#3B82F6" name="Responses" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.label}: ${entry.percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="bg-white p-3 border rounded shadow-lg">
                  <p className="font-medium">{data.label}</p>
                  <p className="text-sm text-gray-600">
                    Responses: {data.value} ({data.percentage}%)
                  </p>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#3B82F6" name="Responses" />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{questionText}</h3>
        <p className="text-sm text-gray-600">
          Total Responses: <span className="font-medium">{totalResponses}</span>
        </p>
      </div>

      {chartType === 'bar' && renderBarChart()}
      {chartType === 'pie' && renderPieChart()}
      {chartType === 'line' && renderLineChart()}

      {/* Data Table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Response Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Option
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Count
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Percentage
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Visual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.label}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.value}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.percentage}%</td>
                  <td className="px-4 py-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
