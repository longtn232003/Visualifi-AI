import { requestApi } from '@/services/api-service'

interface IChangePassword {
  newPassword: string
  currentPassword: string
}

export const changePasswordApi = ({ newPassword, currentPassword }: IChangePassword) => {
  return requestApi({
    path: '/user/change-password',
    method: 'POST',
    body: {
      currentPassword,
      newPassword
    }
  })
}
