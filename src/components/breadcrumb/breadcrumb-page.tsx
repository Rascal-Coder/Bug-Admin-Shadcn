import { ReactNode, useMemo } from 'react'
import { cn } from '@/lib/utils'

export default function BreadcrumbPage({
  children,
  className,
  disabled,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
}) {
  const mergedCls = useMemo(() => cn(
    'text-foreground font-normal cursor-pointer',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ), [className, disabled])
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
