import { ACCESS_TOKEN_COOKIE, API_URL, AUTH_TOKEN_PREFIX } from '@/constants/common'
import { IApiResponse } from '@/types/common'
import { getCookie } from '@/utils/cookie'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
type MethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
interface FetchParams {
  path: string
  method?: MethodType
  body?: object | object[]
}
interface FileFetchParams extends FetchParams {
  fileName?: string
}

const axiosApi = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
})

const onRequest = async (config: InternalAxiosRequestConfig) => {
  const token = getCookie(ACCESS_TOKEN_COOKIE, false)
  const newConfig = config

  if (newConfig.headers) {
    if (!newConfig.headers.Authorization) {
      newConfig.headers.Authorization = `${AUTH_TOKEN_PREFIX}${token}`
    }
  }

  return newConfig
}
const onRequestError = (error: AxiosError<IApiResponse<null>>) => {
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data
}

const onResponseError = (error: AxiosError<IApiResponse<null>>) => {
  if (error.request.responseURL !== `${API_URL}/api/v1/user/profile`) {
    showToast({
      message: error.response?.data?.message || 'Có lỗi xảy ra',
      type: 'error'
    })
  }

  // if (error.response?.status === 401) {
  //   showToast({
  //     message: 'Phiên đăng nhập đã hết hạn',
  //     type: 'error'
  //   })

  //   useAuthStore.getState().setUser(null)
  //   useAuthStore.getState().setAccessToken(null)
  //   removeCookie(ACCESS_TOKEN_COOKIE)
  // }

  return Promise.reject(error)
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)
  return axiosInstance
}

setupInterceptorsTo(axiosApi)

const requestApi = <T = any>(option: FetchParams, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> => {
  switch (option.method) {
    case 'GET':
      return axiosApi.get(option.path, config)
    case 'POST':
      return axiosApi.post(option.path, option.body, config)
    case 'PUT':
      return axiosApi.put(option.path, option.body, config)
    case 'PATCH':
      return axiosApi.patch(option.path, option.body, config)
    case 'DELETE':
      return axiosApi.delete(option.path, config)
    default:
      return axiosApi.get(option.path, config)
  }
}

const requestFileApi = ({ path, method, fileName }: FileFetchParams, config?: AxiosRequestConfig<any>) => {
  axiosApi({
    url: path,
    method: method ?? 'GET',
    responseType: 'blob',
    ...config
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName ?? 'file.pdf')
    document.body.appendChild(link)
    link.click()
  })
}

export { requestApi, requestFileApi }
