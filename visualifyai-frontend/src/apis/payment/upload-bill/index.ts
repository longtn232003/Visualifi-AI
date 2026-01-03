import { requestApi } from '@/services/api-service'
import { UploadFile } from 'antd/es/upload/interface'

export const uploadBillApi = ({ billFile, amount }: { billFile: File | UploadFile; amount: number }) => {
  const file = billFile as File
  const formData = new FormData()
  formData.append('billImage', file)
  formData.append('amount', amount.toString())

  return requestApi(
    {
      method: 'POST',
      path: '/payment/upload-bill',
      body: formData
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
