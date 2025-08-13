import { useMemo, ReactNode } from 'react'
import { Ellipsis } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BreadcrumbItem } from './index'

export interface BreadcrumbEllipsisProps {
  className?: string
  children?: ReactNode
  ellipsisItems?: BreadcrumbItem[]
  onItemClick?: (item: BreadcrumbItem) => void
}

export default function BreadcrumbEllipsis({ 
  className, 
  children,
  ellipsisItems = [],
  onItemClick
}: BreadcrumbEllipsisProps) {
  const mergedClasses = useMemo(() => cn('flex items-center justify-center', className), [className])
  
  return (
    <li
      role='presentation'
      aria-hidden='true'
      className={mergedClasses}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center p-1 hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
            aria-label="Show more breadcrumb items"
          >
            {children || <Ellipsis className="h-4 w-4" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" sideOffset={4}>
          {ellipsisItems.map((item, index) => (
            <DropdownMenuItem
              key={`${item.value}-${index}`}
              onClick={() => onItemClick?.(item)}
              disabled={item.disabled}
              className="flex items-center gap-2"
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className='sr-only'>More</span>
    </li>
  )
}
