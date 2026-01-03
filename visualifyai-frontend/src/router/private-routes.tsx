import { PATH_ROUTES } from '@/constants/path-route'
import { RouteObjectType } from '@/types/router'
import { lazy } from 'react'

const ProfilePage = lazy(() => import('@/pages/profile'))
const EditInfographicPage = lazy(() => import('@/pages/edit-infographic'))
const PaymentPage = lazy(() => import('@/pages/payment'))
const PaymentConfirmPage = lazy(() => import('@/pages/payment-confirm'))

export const privateRoutes: RouteObjectType[] = [
  {
    path: PATH_ROUTES.profile,
    element: <ProfilePage />
  },
  {
    path: PATH_ROUTES.editInfographic,
    element: <EditInfographicPage />
  },
  {
    path: PATH_ROUTES.payment,
    element: <PaymentPage />
  },
  {
    path: PATH_ROUTES.paymentConfirm,
    element: <PaymentConfirmPage />
  }
]
