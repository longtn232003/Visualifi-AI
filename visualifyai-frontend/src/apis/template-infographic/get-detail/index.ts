import { requestApi } from '@/services/api-service'

export interface ITemplateInfographicDetail {
  id: number
  title: string
  description: string
  category: string
  imagePath: string
  createdAt: Date
  updatedAt: Date
}

export const getTemplateInfographicDetailApi = (id: number) => {
  return requestApi<ITemplateInfographicDetail>({
    method: 'GET',
    path: `/infographic-template/${id}`
  })
}
