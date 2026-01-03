import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
type MethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface FetchParams {
  path: string;
  method?: MethodType;
  body?: object | object[];
}
const configService = new ConfigService();

const axiosApi = axios.create({
  baseURL: configService.get('AI_SERVICE_URL') || 'http://160.30.112.194:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000,
});

const onRequest = (config: InternalAxiosRequestConfig) => {
  const newConfig = config;

  // if (newConfig.headers) {
  //   if (!newConfig.headers.Authorization) {
  //     newConfig.headers.Authorization = `${AUTH_TOKEN_PREFIX}${token}`;
  //   }
  // }

  return newConfig;
};

const onRequestError = (error: AxiosError<any>) => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data;
};

const onResponseError = (error: AxiosError<any>) => {
  return Promise.reject(error);
};

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

setupInterceptorsTo(axiosApi);

const requestApi = <T = any>(
  option: FetchParams,
  config?: AxiosRequestConfig<any>,
): Promise<AxiosResponse<T>> => {
  switch (option.method) {
    case 'GET':
      return axiosApi.get(option.path, config);
    case 'POST':
      return axiosApi.post(option.path, option.body, config);
    case 'PUT':
      return axiosApi.put(option.path, option.body, config);
    case 'PATCH':
      return axiosApi.patch(option.path, option.body, config);
    case 'DELETE':
      return axiosApi.delete(option.path, config);
    default:
      return axiosApi.get(option.path, config);
  }
};

export { requestApi };
