import Cookies from 'js-cookie'
import { Outlet, useRouter } from '@tanstack/react-router'
import { Component, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import Breadcrumb, { BreadcrumbItem } from '@/components/breadcrumb'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import SkipToMain from '@/components/skip-to-main'
import { ThemeSwitch } from '@/components/theme-switch'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      value: '/',
      icon: <Home />,
      // disabled: true,
    },
    {
      label: 'Nested',
      value: '/nested',
      icon: <Component />,
      redirect: '/nested/2/1',
    },
    {
      label: 'Nested-2',
      value: '/nested/2',
      icon: <Component />,
      redirect: '/nested/2/1',
    },
    {
      label: 'Nested-2-2',
      value: '/nested/2/2',
      icon: <Component />,
      redirect: '/nested/2/2/1',
    },
    {
      label: 'Nested-2-1-1',
      value: '/nested/2/2/1',
      icon: <Component />,
    },
    // {
    //   label: 'React',
    //   value: 'react',
    //   href: 'https://react.dev',
    //   target: '_blank',
    //   // disabled: true
    // },
    // {
    //   label: 'Breadcrumb2',
    //   value: 'breadcrumb2',
    //   icon: <Dock />,
    // },
  ]
  const router = useRouter()
  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.disabled) return
    if (item.value === '/') {
      router.navigate({
        to: item.value,
        search: {
          q: 'test',
        },
      })
    } else {
      if (item.redirect) {
        router.navigate({
          to: item.redirect,
        })
      } else {
        router.navigate({
          to: item.value,
        })
      }
    }
  }
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
            <Breadcrumb
              items={breadcrumbItems}
              ellipsis
              onItemClick={handleItemClick}
            />
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
