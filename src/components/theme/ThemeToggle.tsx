"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

function setThemeClass(t: 'light' | 'dark') {
    const root = document.documentElement
    if (t === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light'
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    })

    useEffect(() => {
        setThemeClass(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? 'Light' : 'Dark'}
        </Button>
    )
}
