import { requestApi } from '@/services/api-service'

export const forgotPasswordApi = (email: string) => {
  return requestApi({
    method: 'POST',
    path: '/auth/forgot-password',
    body: {
      email
    }
  })
}
