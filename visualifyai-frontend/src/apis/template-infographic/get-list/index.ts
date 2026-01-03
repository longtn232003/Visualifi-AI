import { IPaging } from '@/types/common'
import { requestApi } from '@/services/api-service'
import queryString from 'query-string'

export interface ITemplateInfographic {
  id: number
  title: string
  description: string
  category: string
  imagePath: string
  createdAt: Date
  updatedAt: Date
}

export const getListTemplateInfographic = (params: {
  page?: number
  pageSize?: number
  category?: string
  search?: string
}) => {
  const stringify = queryString.stringify(params)
  return requestApi<{
    list: ITemplateInfographic[]
    meta: IPaging
  }>({
    path: `/infographic-template/list?${stringify}`,
    method: 'GET'
  })
}
