import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function MarketingHeader({ loggedIn }: { loggedIn: boolean }) {
    return (
        <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold">Q-Persona</h1>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground">Marketplace</Link>
                    <Link href="/enterprise" className="text-sm font-medium text-primary hover:opacity-90">Enterprise</Link>
                    <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {loggedIn ? (
                        <Link href="/dashboard">
                            <Button size="sm">Dashboard</Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button size="sm" variant="outline">Sign in</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="sm">Get started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
