import { useMemo, ReactNode } from 'react'
import { Ellipsis } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BreadcrumbEllipsis({ 
  className, 
  children 
}: { 
  className?: string
  children?: ReactNode
}) {
  const mergedClasses = useMemo(() => cn('flex items-center justify-center', className), [className])
  return (
    <li
      role='presentation'
      aria-hidden='true'
      className={mergedClasses}
    >
      {children || <Ellipsis />}
      <span className='sr-only'>More</span>
    </li>
  )
}
