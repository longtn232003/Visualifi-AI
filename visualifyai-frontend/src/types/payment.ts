export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected'
}

export interface PaymentUser {
  id: string
  fullName: string
  email: string
}

export interface PaymentData {
  id: string
  amount: number
  billImagePath: string
  status: PaymentStatus
  createdAt: string
  user: PaymentUser
}

export interface PaymentConfirmResponse {
  data: PaymentData
}
