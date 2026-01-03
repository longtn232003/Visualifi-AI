import { API_URL } from '@/constants/common'

export const getUrlUpload = (url?: string) => {
  if (!url) return ''

  if (url.includes('http')) {
    return url
  }

  return `${API_URL}/${url}`
}
