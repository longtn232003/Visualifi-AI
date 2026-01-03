import { ACCESS_TOKEN_COOKIE } from '@/constants/common'
import { useAuthStore } from '@/stores/auth'
import { setCookie } from '@/utils/cookie'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const { getUserProfile, setAccessToken } = useAuthStore()
  const navigate = useNavigate()

  const handleAuthCallback = useCallback(async () => {
    try {
      const token = searchParams.get('token')
      const provider = searchParams.get('provider')
      const error = searchParams.get('error')
      if (error || !token) {
        showToast({
          type: 'error',
          message: `Đăng nhập ${provider} thất bại`
        })
        return navigate('/')
      }

      setCookie(ACCESS_TOKEN_COOKIE, token)
      setAccessToken(token)
      const user = await getUserProfile()

      if (!user) {
        showToast({
          type: 'error',
          message: `Đăng nhập ${provider} thất bại`
        })
        return navigate('/')
      }

      showToast({
        message: `Đăng nhập thành công`
      })

      return navigate('/')
    } catch (error) {
      console.log(error)
    }
  }, [searchParams, getUserProfile, navigate])

  useEffect(() => {
    handleAuthCallback()
  }, [handleAuthCallback])

  useEffect(() => {
    showLoading()

    return () => {
      hideLoading()
    }
  }, [])

  return <></>
}
