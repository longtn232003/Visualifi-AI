export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business'
}

export interface IUser {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string
  avatarUrl: string
  googleId: string
  facebookId: string
  provider: string //local, google, facebook
  planType: PlanType
  status: UserStatus
  lastUpdatedPassword: Date
  createdAt: Date
  updatedAt: Date
}
