import { requestApi } from '@/services/api-service'
import { InfographicSize, InfographicStyle } from '@/types/infographic'

export interface IInfographicDetail {
  id: number
  prompt: string
  size: InfographicSize
  style: InfographicStyle
  status: string
  title: string
  subtitle: string
  imagePath: string
  watermarked: boolean
  createdAt: string
  updatedAt: string
}

export const getInfographicDetailApi = (id: number) => {
  return requestApi<IInfographicDetail>({
    path: `infographic/${id}`
  })
}
