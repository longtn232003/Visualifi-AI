import { logoutApi } from '@/apis/auth/logout'
import { getProfileApi } from '@/apis/user/profile'
import { ACCESS_TOKEN_COOKIE } from '@/constants/common'
import { IUser } from '@/types/user'
import { getCookie, removeCookie, setCookie } from '@/utils/cookie'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IAuthState {
  user: IUser | null
  accessToken: string | null
}

interface IAuthAction {
  setUser: (user: IUser | null) => void
  setAccessToken: (accessToken: string | null) => void
  logout: () => Promise<void>
  getUserProfile: () => Promise<IUser>
}

export interface AuthStore extends IAuthState, IAuthAction {}

const initialState: IAuthState = {
  user: null,
  accessToken: getCookie(ACCESS_TOKEN_COOKIE) ?? null
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    set => ({
      ...initialState,

      setAccessToken: (accessToken: string) => {
        set({ accessToken })
        setCookie(ACCESS_TOKEN_COOKIE, accessToken)
      },

      setUser: (user: IUser) => {
        set({ user })
      },

      logout: async () => {
        try {
          showLoading()
          await logoutApi()
          set({ user: null, accessToken: null })
          removeCookie(ACCESS_TOKEN_COOKIE)
          hideLoading()
        } catch {
          hideLoading()
        }
      },

      getUserProfile: async () => {
        try {
          const response = await getProfileApi()
          set({ user: response.data })
          return response.data
        } catch {
          throw new Error('Failed to get user profile')
        }
      }
    }),
    {
      name: 'Auth Store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)
