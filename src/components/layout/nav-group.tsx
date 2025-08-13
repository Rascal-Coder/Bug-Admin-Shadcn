import { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'
import { NavItem, type NavGroup } from './types'

export function NavGroup({ title, items }: NavGroup) {
  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items || item.items.length === 0)
            return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuLink = ({ item, href }: { item: NavItem; href: string }) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isItemActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url!} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span className='truncate'>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavItem
  href: string
}) => {
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible
      asChild
      defaultOpen={isItemActive(href, item)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            {item.icon && <item.icon />}
            <span className='truncate'>{item.title}</span>
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SubItemNode
                key={`${subItem.title}-${subItem.url ?? 'group'}`}
                item={subItem}
                href={href}
                onLeafClick={() => setOpenMobile(false)}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavItem
  href: string
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isItemActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span className='truncate'>{item.title}</span>
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items?.map((sub) => (
            <DropdownItemNode
              key={`${sub.title}-${sub.url ?? 'group'}`}
              item={sub}
              href={href}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function isItemActive(href: string, item: NavItem): boolean {
  const hrefPath = href.split('?')[0]
  if (item.url && (href === item.url || hrefPath === item.url)) return true
  if (item.items && item.items.length > 0) {
    return item.items.some((child) => isItemActive(href, child))
  }
  return false
}

const SubItemNode = ({
  item,
  href,
  onLeafClick,
}: {
  item: NavItem
  href: string
  onLeafClick: () => void
}) => {
  const hasChildren = !!item.items && item.items.length > 0
  const active = isItemActive(href, item)
  if (!hasChildren) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={active}>
          <Link to={item.url!} onClick={onLeafClick}>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            {item.icon && <item.icon />}
            <span className='truncate'>{item.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={active} className='group/collapsible'>
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton isActive={active}>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            {item.icon && <item.icon />}
            <span className='truncate'>{item.title}</span>
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items?.map((child) => (
              <SubItemNode
                key={`${child.title}-${child.url ?? 'group'}`}
                item={child}
                href={href}
                onLeafClick={onLeafClick}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

const DropdownItemNode = ({ item, href }: { item: NavItem; href: string }) => {
  const hasChildren = !!item.items && item.items.length > 0
  const active = isItemActive(href, item)
  if (!hasChildren) {
    return (
      <DropdownMenuItem asChild>
        <Link to={item.url!} className={`${active ? 'bg-secondary' : ''}`}>
          {item.icon && <item.icon />}
          <span className='max-w-52 text-wrap'>{item.title}</span>
          {/* TODO: add badge */}
          {/* {item.badge && <span className='ml-auto text-xs'>{item.badge}</span>} */}
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={`${active ? 'bg-secondary' : ''}`}>
        {item.icon && <item.icon className='size-4' />}
        <span className='max-w-52 text-wrap'>{item.title}</span>
        {/* TODO: add badge */}
        {/* {item.badge && <span className='ml-auto text-xs'>{item.badge}</span>} */}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent alignOffset={-4}>
        {item.items?.map((child) => (
          <DropdownItemNode
            key={`${child.title}-${child.url ?? 'group'}`}
            item={child}
            href={href}
          />
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
