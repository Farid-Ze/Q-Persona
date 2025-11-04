import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/layouts/DashboardShell'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const { user } = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <DashboardShell userEmail={user.email}>
      <div className="py-2">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your questionnaires and personas
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$1,250.00</div>
              <p className="text-xs text-muted-foreground mt-1">+12.5% vs last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Customers</CardTitle>
              <CardDescription>Acquisition needs attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">-20% vs last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Accounts</CardTitle>
              <CardDescription>Engagement exceed targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45,678</div>
              <p className="text-xs text-muted-foreground mt-1">+12.5% vs last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Rate</CardTitle>
              <CardDescription>Meets growth projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.5%</div>
              <p className="text-xs text-muted-foreground mt-1">+4.5% vs last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Total Visitors</CardTitle>
                <CardDescription>Total for the last 3 months</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Last 3 months</Badge>
                <Badge variant="outline">Last 30 days</Badge>
                <Badge variant="outline">Last 7 days</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded-md bg-gradient-to-b from-muted/60 to-muted border" />
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <Link href="/dashboard/personas" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Personas</CardTitle>
                <CardDescription>
                  Create and manage user personas for your questionnaires
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/templates" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>
                  Design reusable questionnaire templates
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/questionnaires" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Questionnaires</CardTitle>
                <CardDescription>
                  Create and deploy questionnaires to collect responses
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/respondents" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Respondents</CardTitle>
                <CardDescription>
                  View and manage survey respondents
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/answers" className="block">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Answers</CardTitle>
                <CardDescription>
                  Analyze collected responses and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>


      </div>
    </DashboardShell>
  )
}
