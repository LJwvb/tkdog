import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import type { IApiResponse } from '@/types';
import store from '@/store';

// 默认走 vite 代理（同源）
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const http = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  withCredentials: true,
});

// ===== 无感刷新 Token 相关状态 =====
let isRefreshing = false;
// 请求队列：存储等待刷新完成后重发的请求 resolve 函数
let pendingRequests: Array<(token: string) => void> = [];

/**
 * 从 store 获取 accessToken
 */
function getAccessToken(): string | undefined {
  return (
    (store.state.userData as any)?.accessToken ||
    (store.state.userData as any)?.token
  );
}

/**
 * 从 store 获取 refreshToken
 */
function getRefreshToken(): string | undefined {
  return (store.state.userData as any)?.refreshToken;
}

/**
 * 调用后端刷新 Token 接口
 */
async function doRefreshToken(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await axios.post(`${baseUrl}/refreshToken`, { refreshToken });
    const data = res.data?.data;
    if (data?.accessToken) {
      // 更新 store 中的 token
      const userData = {
        ...store.state.userData,
        token: data.accessToken,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      store.commit('setUserData', userData);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 清除登录态并跳转登录页。
 * 两种身份独立：若当前处于管理端（持有 adminData），说明是 adminAuth 拒绝了请求，
 * 只清管理员身份并跳 /admin；否则按普通用户处理，清 userData 跳 /Login。
 */
function clearAuthAndRedirect() {
  const isAdminSide = Boolean((store.state as any).adminData?.id);
  if (isAdminSide) {
    store.commit('clearAdminData');
    window.location.hash = '#/admin';
    return;
  }
  store.commit('setUserData', {} as any);
  window.location.hash = '#/Login';
}

/**
 * 统一请求拦截器：
 * - 从 store 中获取 JWT Token，添加到 Authorization header
 */
http.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * 统一响应拦截器：
 * - 业务错误：toast 提示并 reject
 * - 401：无感刷新 Token，刷新失败才跳登录页
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
  async (error: AxiosError<{ message?: string }>) => {
    const status = error?.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const requestUrl = originalRequest?.url || '';

    // 401 处理：无感刷新 Token
    if (status === 401) {
      // 刷新接口本身 401，说明 refreshToken 也过期了，直接跳登录页
      if (requestUrl.includes('/refreshToken')) {
        ElMessage.error('登录已过期，请重新登录');
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      // 已经重试过一次，不再重试，直接跳登录页
      if (originalRequest._retry) {
        ElMessage.error('登录已过期，请重新登录');
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      // 如果正在刷新，把当前请求加入队列，等待刷新完成后重发
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(http(originalRequest));
          });
        });
      }

      // 开始刷新 Token
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshResult = await doRefreshToken();
        if (refreshResult?.accessToken) {
          const newToken = refreshResult.accessToken;
          // 重放队列中的所有请求
          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];
          // 重发当前请求
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return http(originalRequest);
        } else {
          // 刷新失败，清除登录态
          ElMessage.error('登录已过期，请重新登录');
          clearAuthAndRedirect();
          return Promise.reject(error);
        }
      } finally {
        isRefreshing = false;
      }
    }

    // 其他错误：统一 toast 提示
    const message =
      error?.response?.data?.message ||
      (error?.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '') ||
      error?.message ||
      '网络请求失败，请检查后端服务是否已启动';
    ElMessage.error(message);
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
