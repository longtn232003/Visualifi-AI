import { requestApi } from '@/services/api-service'

export interface ICategories {
  name: string
  count: number
}

export const getCategories = () => {
  return requestApi<ICategories[]>({
    path: '/infographic-template/categories-list',
    method: 'GET'
  })
}
