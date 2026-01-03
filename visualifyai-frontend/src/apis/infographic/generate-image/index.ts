import { requestApi } from '@/services/api-service'
import { InfographicSize, InfographicStyle } from '@/types/infographic'

interface IGenerateImageApi {
  prompt: string
  size?: InfographicSize
  style?: InfographicStyle
}

export enum InfographicStatus {
  Completed = 'Completed',
  Processing = 'Processing',
  Failed = 'Failed'
}

export interface IGenerateImageResponse {
  id: number
  userId: number
  inputId: number
  status: InfographicStatus
  imagePath: string
  watermarked: boolean
  createdAt: string
}

export const generateImageApi = (data: IGenerateImageApi) => {
  return requestApi<IGenerateImageResponse>({
    path: 'infographic/ai-generate',
    method: 'POST',
    body: data
  })
}
