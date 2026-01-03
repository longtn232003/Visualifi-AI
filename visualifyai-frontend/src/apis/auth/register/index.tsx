import { requestApi } from '@/services/api-service'

interface IRegisterParams {
  fullName: string
  email: string
  password: string
}

export const registerApi = (data: IRegisterParams) => {
  return requestApi({
    path: '/auth/register',
    method: 'POST',
    body: data
  })
}
