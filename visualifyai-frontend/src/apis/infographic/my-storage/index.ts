import { requestApi } from '@/services/api-service'
import { IPaging } from '@/types/common'
import queryString from 'query-string'

export interface IInfographicSaved {
  id: number
  infographicId: number
  title: string
  description: string
  imagePath: string
  watermarked: boolean
  size: string
  style: string
  prompt: string
  savedAt: string
  updatedAt: string
  generatedAt: string
}

interface IGetInfographicMyStorageResponse {
  list: IInfographicSaved[]
  meta: IPaging
}

interface IGetInfographicMyStorageParams {
  page: number
  pageSize: number
}

export const getInfographicMyStorage = async (params: IGetInfographicMyStorageParams) => {
  const stringify = queryString.stringify(params)
  return requestApi<IGetInfographicMyStorageResponse>({
    path: `infographic/my-storage/list?${stringify}`,
    method: 'GET'
  })
}

export const deleteInfographicMyStorage = async (id: number) => {
  return requestApi<IInfographicSaved>({
    path: `infographic/my-storage/delete/${id}`,
    method: 'DELETE'
  })
}
