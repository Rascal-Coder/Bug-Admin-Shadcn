import { ReactNode, useMemo } from 'react'
import { cn } from '@/lib/utils'

export default function BreadcrumbPage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const mergedCls = useMemo(() => cn('text-foreground font-normal', className), [className])
  return (
    <span
      role='link'
      aria-disabled='true'
      className={mergedCls}
      aria-current='page'
    >
      {children}
    </span>
  )
}
