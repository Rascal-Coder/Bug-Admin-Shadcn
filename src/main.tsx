import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRoute, createRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { handleServerError } from '@/utils/handle-server-error'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'

import Tasks from '@/features/tasks'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import Dashboard from '@/features/dashboard'
import RootRoute from '@/root.layout'
import SignIn from '@/features/auth/sign-in'
import GeneralError from '@/features/errors/general-error'
import ForbiddenError from '@/features/errors/forbidden'
import UnauthorisedError from '@/features/errors/unauthorized-error'
import MaintenanceError from '@/features/errors/maintenance-error'
import SignIn2 from '@/features/auth/sign-in/sign-in-2'
import SignUp from '@/features/auth/sign-up'
import Users from '@/features/users'
import ForgotPassword from '@/features/auth/forgot-password'
import OTP from '@/features/auth/otp'
import NotFoundError from '@/features/errors/not-found-error'
import Settings from '@/features/settings'
import SettingsProfile from '@/features/settings/profile'
import SettingsAccount from '@/features/settings/account'
import SettingsAppearance from '@/features/settings/appearance'
import ComingSoon from '@/components/coming-soon'
import Nested1 from './features/nested/nested-1'
import Nested21 from './features/nested/nested-2/nested-2-1'

const AuthenticatedRouteRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'root-layout',
  component: AuthenticatedLayout,
})

const AuthenticatedIndexRoute = createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: Dashboard,
  path: '/',
})

const TasksRoute = createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: Tasks,
  path: 'tasks',
})
const UsersRoute = createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: Users,
  path: 'users',
})

const  SignIn2Route = createRoute({
  getParentRoute: () => RootRoute,
  component: SignIn2,
  path: 'sign-in-2',
})

const SignInRoute = createRoute({
  getParentRoute: () => RootRoute,
  component: SignIn,
  path: 'sign-in',
})

const SignUpRoute = createRoute({
  getParentRoute: () => RootRoute,
  component: SignUp,
  path: 'sign-up',
})

const ForgotPasswordRoute = createRoute({
  getParentRoute: () => RootRoute,
  component: ForgotPassword,
  path: 'forgot-password',
})

const OTPRoute = createRoute({
  getParentRoute: () => RootRoute,
  component: OTP,
  path: 'otp',
})

const errors401Route = createRoute({
  getParentRoute: () => RootRoute,
  component: () => <UnauthorisedError />,
  path: '401',
})

const errors403Route = createRoute({
  getParentRoute: () => RootRoute,
  component: () => <ForbiddenError />,
  path: '403',
})

const errors404Route = createRoute({
  getParentRoute: () => RootRoute,
  component: () => <NotFoundError />,
  path: '404',
})

const errors500Route = createRoute({
  getParentRoute: () => RootRoute,
  component: () => <GeneralError />,
  path: '500',
})

const errors503Route = createRoute({
  getParentRoute: () => RootRoute,
  component: () => <MaintenanceError />,
  path: '503',
})

const SettingsLayoutRoute = createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: Settings,
  id:'settings-layout'
})

const SettingsProfileRoute = createRoute({
  getParentRoute: () => SettingsLayoutRoute,
  component: SettingsProfile,
  path: 'settings/profile',
})

const SettingsAccountRoute = createRoute({
  getParentRoute: () => SettingsLayoutRoute,
  component: SettingsAccount,
  path: 'settings/account',
})

const SettingsAppearanceRoute = createRoute({
  getParentRoute: () => SettingsLayoutRoute,
  component: SettingsAppearance,
  path: 'settings/appearance',
})

const HelpCenterRoute = createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: ComingSoon,
  path: 'help-center',
})

const NestedRoute1= createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: Nested1,
  path: 'nested/1',
})
const NestedRoute21= createRoute({
  getParentRoute: () => AuthenticatedRouteRoute,
  component: Nested21,
  path: 'nested/2/1',
})

const routeTree = RootRoute.addChildren([
  AuthenticatedRouteRoute.addChildren([
    AuthenticatedIndexRoute,
    TasksRoute,
    UsersRoute,
    HelpCenterRoute,
    NestedRoute1,
    NestedRoute21
  ]),
  SettingsLayoutRoute.addChildren([
    SettingsProfileRoute,
    SettingsAccountRoute,
    SettingsAppearanceRoute,
  ]),
  SignInRoute,
  SignIn2Route,
  SignUpRoute,
  ForgotPasswordRoute,
  OTPRoute,
  errors500Route,
  errors403Route,
  errors401Route,
  errors503Route,
  errors404Route,
])
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!')
          useAuthStore.getState().auth.reset()
          // const redirect = `${router.history.location.href}`
          // router.navigate({ to: '/sign-in', search: { redirect } })
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
          // router.navigate({ to: '/500' })
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' { 
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <FontProvider>
            <RouterProvider router={router} />
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
