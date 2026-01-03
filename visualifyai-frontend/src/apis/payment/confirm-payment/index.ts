import { requestApi } from '@/services/api-service'

export const adminConfirmPaymentApi = ({
  token,
  status,
  adminNote
}: {
  token: string
  status: string
  adminNote: string
}) => {
  return requestApi({
    method: 'PUT',
    path: `/payment/confirm/${token}`,
    body: { status, adminNote }
  })
}

export const adminGetPaymentDetailsApi = (token: string) => {
  return requestApi({
    method: 'GET',
    path: `/payment/confirmation/${token}`
  })
}
