import * as React from 'react'
import { cn } from '@/lib/utils'

export function Separator({
    orientation = 'horizontal',
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }) {
    return (
        <div
            role="separator"
            aria-orientation={orientation}
            className={cn(
                'shrink-0 bg-border',
                orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full',
                className
            )}
            {...props}
        />
    )
}
