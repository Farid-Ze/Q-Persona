"use client"
import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
}

const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
    default:
        'bg-primary text-primary-foreground hover:opacity-90',
    secondary:
        'bg-secondary text-secondary-foreground hover:opacity-90',
    outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost:
        'hover:bg-accent hover:text-accent-foreground',
    destructive:
        'bg-destructive text-destructive-foreground hover:opacity-90',
}

const sizes: Record<Size, string> = {
    sm: 'h-8 rounded-md px-3',
    md: 'h-9 rounded-md px-4',
    lg: 'h-10 rounded-md px-6',
    icon: 'h-9 w-9',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'
