import axios from 'axios';
import { oturumTemizle, tokenKaydet } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type": "application/json",
    },
    timeout:3000,
    withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3000,
  withCredentials: true
});

  let refreshInFlight: Promise<string> | null = null;

const accessTokenYenile = async (): Promise<string> => {
  const { data } = await refreshClient.post<{ accessToken: string }>('/auth/refresh');
  tokenKaydet(data.accessToken);
  return data.accessToken;
};

//api.interceptors.request.use(
  //(config) => {
    //const token = sessionStorage.getItem('token');
    //if (token) {
      //config.headers.Authorization = `Bearer ${token}`;
    //}
    //return config;
  //},
  //(error) => {
    //return Promise.reject(error);
  //}
//);
api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes('/auth/giris') || config.url?.includes('/auth/refresh') || config.url?.includes('/auth/logout');
    const token = sessionStorage.getItem('token');
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const requestUrl = String(originalRequest?.url ?? '');

    const isAuthEndpoint = requestUrl.includes('/auth/giris') || requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/logout');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        if (!refreshInFlight) {
          refreshInFlight = accessTokenYenile();
        }

        const newAccessToken = await refreshInFlight;
        refreshInFlight = null;

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        refreshInFlight = null;
        oturumTemizle();
        if (window.location.pathname !== '/giris') {
          window.location.href = '/giris';
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && !isAuthEndpoint) {
      oturumTemizle();
      if (window.location.pathname !== '/giris') {
        window.location.href = '/giris';
      }
    }

    return Promise.reject(error);
  }
);

export const getApiBaseUrl = () => API_BASE_URL;

export const normalizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default api;