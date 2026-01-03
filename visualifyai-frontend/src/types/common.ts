export interface IApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface IPaging {
  page: number
  pageSize: number
  totalPage: number
  totalItem: number
}

export enum PaymentPackage {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS'
}
