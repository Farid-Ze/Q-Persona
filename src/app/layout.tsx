import type { Metadata } from 'next'
import './globals.css'

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
