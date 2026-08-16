import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
import type { IApiResponse } from '@/types';

// 默认走 vite 代理（同源），避免跨域导致 session cookie 无法携带
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const http = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  withCredentials: true,
});

/**
 * 统一响应拦截器：
 * - 业务错误（success === false 或 code 非 200/0）：toast 提示并 reject
 * - HTTP 错误：统一 toast 提示，401 跳转登录页
 */
http.interceptors.response.use(
  (response) => {
    const body = response.data as IApiResponse | undefined;
    if (body && typeof body === 'object' && 'code' in body) {
      const { code, message, success } = body;
      if (success === false || (code !== 200 && code !== 0)) {
        ElMessage.error(message || '请求失败');
        return Promise.reject(body);
      }
    }
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      (error?.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '') ||
      error?.message ||
      '网络请求失败，请检查后端服务是否已启动';

    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录');
      // 项目使用 hash 路由，直接通过 hash 跳转登录页
      window.location.hash = '#/Login';
    } else {
      ElMessage.error(message);
    }
    return Promise.reject(error);
  },
);

/**
 * 统一请求入口。
 *
 * 后端响应体为 `{ code, message, data, success }`，本函数已在拦截层
 * 解出业务数据 `data`，因此返回值就是业务体 `T`，调用方无需再关心
 * `res.data` / `res.data.data` / `res.code` 等层级。
 */
export const request = <T = unknown>(
  method: string,
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> =>
  http
    .request<IApiResponse<T>>({
      method,
      url,
      ...config,
    })
    .then((res) => res.data.data as T);
