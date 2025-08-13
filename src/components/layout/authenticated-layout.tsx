import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import SkipToMain from '@/components/skip-to-main'
import { ThemeSwitch } from '@/components/theme-switch'
import Breadcrumb, { BreadcrumbItem } from '@/components/breadcrumb'
import { Component, Dock, Home } from 'lucide-react'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      value: 'home',
      icon: <Home />,
    },
    {
      label: 'Components',
      value: 'components',
      icon: <Component />
    },
    {
      label: 'Breadcrumb',
      value: 'breadcrumb',
      icon: <Dock />
      // TODO click event
    },
    {
      label: 'Components2',
      value: 'components2',
      icon: <Component />
    },
    {
      label: 'React',
      value: 'react',
      href: 'https://react.dev',
      target: '_blank',
      // disabled: true
    },
    {
      label: 'Breadcrumb2',
      value: 'breadcrumb2',
      icon: <Dock />
    }
  ];
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          {/* ===== Top Heading ===== */}
          <Header>
            <Breadcrumb items={breadcrumbItems}  ellipsis/>
            <div className='ml-auto flex items-center space-x-4'>
              <Search />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          {children ? children : <Outlet />}
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
