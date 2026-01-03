import { requestApi } from '@/services/api-service'

export const logoutApi = () => {
  return requestApi({
    method: 'POST',
    path: '/auth/logout'
  })
}
