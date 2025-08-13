import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo, ReactNode } from 'react'

export default function BreadcrumbSeparator({ className, children }: { className?: string; children?: ReactNode }) {
  const mergedCls = useMemo(() => cn('text-muted-foreground flex-shrink-0 list-none', className), [className])
  return (
    <span aria-hidden='true' role="presentation" className={mergedCls}>
      {children || <ChevronRight />}
    </span>
  )
}
