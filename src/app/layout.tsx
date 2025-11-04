import type { Metadata } from 'next'
import './globals.css'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import { ThemeScript } from '@/components/theme/ThemeScript'

export const metadata: Metadata = {
  title: 'Q-Persona - Lean Architecture',
  description: 'Modern serverless questionnaire and persona management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThemeScript />
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
