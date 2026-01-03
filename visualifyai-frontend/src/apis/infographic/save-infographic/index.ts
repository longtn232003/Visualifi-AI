import { requestApi } from '@/services/api-service'

interface ISaveInfographicParams {
  infographicId: number
  title: string
  description?: string
}

export const saveInfographicApi = (data: ISaveInfographicParams) => {
  return requestApi({
    path: 'infographic/my-storage/save',
    method: 'POST',
    body: data
  })
}
