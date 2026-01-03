import { requestApi } from '@/services/api-service'
import { IUser } from '@/types/user'

export const getProfileApi = () => {
  return requestApi<IUser>({
    path: '/user/profile'
  })
}
