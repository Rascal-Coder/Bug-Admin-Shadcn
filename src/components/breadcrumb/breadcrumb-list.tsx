import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function BreadcrumbList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ol className={cn('flex flex-wrap items-center my-0 break-words text-muted-foreground', className)}>{children}</ol>
  )
}