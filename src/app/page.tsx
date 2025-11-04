import Link from 'next/link'
import { getUser } from '@/app/actions/auth'
import { MarketingHeader } from '@/components/layouts/MarketingHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const { user } = await getUser()

  return (
    <main className="min-h-screen">
      <MarketingHeader loggedIn={!!user} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero - matches shadcn dashboard style */}
        <section className="relative isolate overflow-hidden border-b bg-gradient-to-b from-background to-muted/40 rounded-xl">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="flex justify-center">
              <Badge variant="secondary" className="gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                New Components: Field, Input Group, Item and more
              </Badge>
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              The Foundation for your Design System
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline">View Components</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$1,250.00</div>
              <p className="text-xs text-muted-foreground mt-1">Trending up this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Customers</CardTitle>
              <CardDescription>Acquisition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">Down 20% this period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Accounts</CardTitle>
              <CardDescription>Engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45,678</div>
              <p className="text-xs text-muted-foreground mt-1">Strong user retention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Rate</CardTitle>
              <CardDescription>Projection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Steady performance increase</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick links / feature cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Link href="/dashboard/personas" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Personas</CardTitle>
                <CardDescription>Create and manage user personas</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/templates" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Design questionnaire templates</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/questionnaires" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Questionnaires</CardTitle>
                <CardDescription>Create and deploy questionnaires</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Small features list */}
        <div className="mt-12 p-6 rounded-lg bg-muted/60 border">
          <h3 className="text-lg font-semibold mb-2">Architecture Features</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Next.js Frontend (React with SSR/SSG)</li>
            <li>Supabase Backend (Authentication & Database)</li>
            <li>Server Actions for type-safe mutations</li>
            <li>PostgreSQL Database</li>
            <li>Modern authentication system</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
