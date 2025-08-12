import { NavigationProgress } from "@/components/navigation-progress"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Toaster } from "sonner"
import NotFoundError from "@/features/errors/not-found-error"
import GeneralError from "@/features/errors/general-error"

const RootRoute = createRootRouteWithContext<{
    queryClient: QueryClient
  }>()({
    component: () => {
      return (
        <>
          <NavigationProgress />
          <Outlet />
          <Toaster duration={50000} />
          {import.meta.env.MODE === 'development' && (
            <>
              <ReactQueryDevtools buttonPosition='bottom-left' />
              <TanStackRouterDevtools position='bottom-right' />
            </>
          )}
        </>
      )
    },
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
  })

  export default RootRoute