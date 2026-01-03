import { ErrorBoundary } from '@/components/common/error-boundary'
import { Loading } from '@/components/common/loading'
import { NotFound } from '@/components/common/not-found'
import { DefaultLayout } from '@/components/layout/default-layout'
import { RouteObjectType } from '@/types/router'
import { Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import { privateRoutes } from './private-routes'
import { ProtectedRoute } from './protected-route'
import { publicRoutes } from './public-routes'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const RouterWithScrollToTop = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export const RouterRenderer = () => {
  const processRoutes = (routes: RouteObjectType[]) => {
    return routes.map(route => {
      const { hasLayout = true, roles = [], ...rest } = route
      let element = route.element

      if (hasLayout) {
        element = <DefaultLayout>{route.element}</DefaultLayout>
      }

      const processedRoute = {
        ...rest,
        element,
        meta: {
          roles
        }
      }

      if (route.children) {
        processedRoute.children = processRoutes(route.children)
      }

      return processedRoute
    })
  }

  const buildRoutesWithRoles = (routes: RouteObjectType[]) => {
    return routes.map(route => {
      const { hasLayout = true, roles = [], element, children, path } = route

      if (!path) {
        return {
          element: <Outlet />,
          children: children && buildRoutesWithRoles(children)
        }
      }

      const createProtectedElement = (element: React.ReactNode) => (
        <ProtectedRoute allowedRoles={roles}>
          {hasLayout ? <DefaultLayout>{element}</DefaultLayout> : element}
        </ProtectedRoute>
      )

      return {
        path,
        element: createProtectedElement(element),
        ...(children && { children: buildRoutesWithRoles(children) })
      }
    })
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RouterWithScrollToTop />,
      children: [
        // public routes
        {
          children: processRoutes(publicRoutes),
          errorElement: <ErrorBoundary />
        },
        // private routes
        {
          element: <ProtectedRoute />,
          children: buildRoutesWithRoles(privateRoutes),
          errorElement: <ErrorBoundary />
        }
      ]
    },
    // 404 route
    {
      path: '*',
      element: <NotFound />,
      errorElement: <ErrorBoundary />
    }
  ])

  return (
    <Suspense fallback={<Loading show />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
