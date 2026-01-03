import { PaymentPackage } from '@/types/common'

export const API_URL = import.meta.env.VITE_API_URL
export const AUTH_TOKEN_PREFIX = 'Bearer '

// access token cookie
export const ACCESS_TOKEN_COOKIE = 'auth_access_token'

export const PaymentAmount = {
  [PaymentPackage.FREE]: 0,
  [PaymentPackage.PRO]: 99000,
  [PaymentPackage.BUSINESS]: 349000
}
