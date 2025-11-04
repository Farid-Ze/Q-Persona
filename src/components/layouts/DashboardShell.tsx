import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

export function DashboardShell({
    userEmail,
    children,
}: {
    userEmail?: string | null
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="font-semibold">Q-Persona</Link>
                    </div>
                    <div className="flex-1 max-w-xl">
                        <Input placeholder="Search…" aria-label="Search" />
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="hidden sm:flex items-center gap-2">
                            <Avatar initials={(userEmail || 'Q')[0]} size="sm" />
                            <span className="text-sm text-muted-foreground">{userEmail}</span>
                        </div>
                        <form action={signOut}>
                            <Button variant="outline" size="sm">Sign out</Button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <nav className="text-sm space-y-6">
                        <div>
                            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Home</p>
                            <ul className="space-y-1">
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="/dashboard">Dashboard</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Lifecycle</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Analytics</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Projects</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Team</Link></li>
                            </ul>
                        </div>
                        <Separator />
                        <div>
                            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Documents</p>
                            <ul className="space-y-1">
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Data Library</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Reports</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">Word Assistant</Link></li>
                                <li><Link className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground" href="#">More</Link></li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <main>{children}</main>
            </div>
        </div>
    )
}
