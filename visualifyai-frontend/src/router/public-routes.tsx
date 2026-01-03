import { Unauthorized } from '@/components/common/unauthorized'
import { PATH_ROUTES } from '@/constants/path-route'
import { AuthCallbackPage } from '@/pages/auth-callback'
import { RouteObjectType } from '@/types/router'
import { lazy } from 'react'

const HomePage = lazy(() => import('@/pages/home'))
const CreateInfographicPage = lazy(() => import('@/pages/create-infographic'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'))
const TemplateStorePage = lazy(() => import('@/pages/template-store'))
const PricingPage = lazy(() => import('@/pages/pricing'))

export const publicRoutes: RouteObjectType[] = [
  {
    path: PATH_ROUTES.unauthorized,
    element: <Unauthorized />
  },
  {
    path: PATH_ROUTES.home,
    element: <HomePage />
  },
  {
    path: PATH_ROUTES.createInfographic,
    element: <CreateInfographicPage />
  },
  {
    path: PATH_ROUTES.resetPassword,
    element: <ResetPasswordPage />
  },
  {
    path: PATH_ROUTES.templateStore,
    element: <TemplateStorePage />
  },
  {
    path: PATH_ROUTES.pricing,
    element: <PricingPage />
  },
  {
    path: PATH_ROUTES.authCallback,
    element: <AuthCallbackPage />,
    hasLayout: false
  }
]
