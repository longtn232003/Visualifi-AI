import { requestApi } from '@/services/api-service'

interface ILoginParams {
  email: string
  password: string
}

interface ILoginResponse {
  accessToken: string
}

export const loginApi = (data: ILoginParams) => {
  return requestApi<ILoginResponse>({
    path: '/auth/login',
    method: 'POST',
    body: data
  })
}
