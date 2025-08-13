import { ReactNode, useMemo, forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

export interface BreadcrumbLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  className?: string
  href?: string
  disabled?: boolean
  target?: string
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ children, className, href, disabled, target, ...props }, ref) => {
    const mergedCls = useMemo(
      () =>
        cn(
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'text-foreground font-normal hover:underline transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary',
          className
        ),
      [className, disabled]
    )

    return (
      <div className='flex items-center gap-1'>
        <a
          ref={ref}
          href={disabled ? undefined : href}
          aria-disabled={disabled}
          target={target}
          className={mergedCls}
          onClick={disabled ? (e) => e.preventDefault() : undefined}
          {...props}
        >
          {children}
        </a>
        <ArrowUpRight className='w-3 h-3 shrink-0 self-start text-muted-foreground' />
      </div>
    )
  }
)

BreadcrumbLink.displayName = 'BreadcrumbLink'

export default BreadcrumbLink
