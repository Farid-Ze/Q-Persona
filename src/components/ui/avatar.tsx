import Image from 'next/image'
import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'
const sizes: Record<Size, { w: number; h: number; className: string }> = {
    sm: { w: 32, h: 32, className: 'h-8 w-8' },
    md: { w: 40, h: 40, className: 'h-10 w-10' },
    lg: { w: 48, h: 48, className: 'h-12 w-12' },
}

export function Avatar({
    src,
    alt,
    initials,
    size = 'md',
    className,
}: {
    src?: string | null
    alt?: string
    initials?: string
    size?: Size
    className?: string
}) {
    const dim = sizes[size]
    return (
        <div className={cn('relative rounded-full overflow-hidden bg-muted flex items-center justify-center', dim.className, className)}>
            {src ? (
                <Image src={src} alt={alt || 'Avatar'} width={dim.w} height={dim.h} className="object-cover" />
            ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                    {initials?.slice(0, 2).toUpperCase()}
                </span>
            )}
        </div>
    )
}
