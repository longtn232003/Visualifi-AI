import Cookies from 'js-cookie'

/**
 * Save a value to cookie
 */
export const setCookie = (key: string, value: any, options?: Cookies.CookieAttributes): void => {
  try {
    const cookieValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
    Cookies.set(key, cookieValue, {
      expires: 7, // Default 7 days
      secure: window.location.protocol === 'https:',
      sameSite: 'lax',
      ...options
    })
  } catch (error) {
    console.error('Error saving cookie:', error)
  }
}

/**
 * Get value from cookie
 */
export const getCookie = (key: string, parseJson: boolean = true) => {
  try {
    const value = Cookies.get(key)
    if (!value) return null

    if (parseJson) {
      try {
        return JSON.parse(value)
      } catch {
        // If not JSON, return string
        return value
      }
    }

    return value
  } catch (error) {
    console.error('Error reading cookie:', error)
    return null
  }
}

/**
 * Update cookie value (same as setCookie)
 */
export const updateCookie = (key: string, value: any, options?: Cookies.CookieAttributes): void => {
  setCookie(key, value, options)
}

/**
 * Remove cookie
 */
export const removeCookie = (key: string, options?: Cookies.CookieAttributes): void => {
  try {
    Cookies.remove(key, options)
  } catch (error) {
    console.error('Error removing cookie:', error)
  }
}

/**
 * Check if cookie exists
 */
export const hasCookie = (key: string): boolean => {
  return Cookies.get(key) !== undefined
}

/**
 * Get all cookies
 */
export const getAllCookies = (): { [key: string]: string } => {
  try {
    return Cookies.get()
  } catch (error) {
    console.error('Error getting all cookies:', error)
    return {}
  }
}

/**
 * Clear all cookies
 */
export const clearAllCookies = (domain?: string): void => {
  try {
    const cookies = getAllCookies()
    Object.keys(cookies).forEach(key => {
      removeCookie(key, domain ? { domain } : undefined)
    })
  } catch (error) {
    console.error('Error clearing all cookies:', error)
  }
}
