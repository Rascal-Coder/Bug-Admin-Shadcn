import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function BreadcrumbRoot({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <nav aria-label='Breadcrumb' className={cn('text-sm', className)}>
      {children}
    </nav>
  )
}
