import { useAuthStore } from '@/stores/auth'
import { useEffect } from 'react'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { getUserProfile } = useAuthStore()

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <>{children}</>
}
