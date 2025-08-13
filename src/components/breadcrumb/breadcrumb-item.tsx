import { ReactNode, useMemo } from 'react'
import { cn } from '@/lib/utils'

export default function BreadcrumbItem({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const mergedCls = useMemo(() => cn('inline-flex items-center list-none gap-2', className), [className])
  return <li className={mergedCls} onClick={onClick}>{children}</li>
}
