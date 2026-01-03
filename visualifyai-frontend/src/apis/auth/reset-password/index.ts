import { requestApi } from '@/services/api-service'

export const resetPasswordApi = ({ newPassword, token }: { newPassword: string; token: string }) => {
  return requestApi(
    {
      path: '/auth/reset-password',
      method: 'POST',
      body: {
        newPassword
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}
