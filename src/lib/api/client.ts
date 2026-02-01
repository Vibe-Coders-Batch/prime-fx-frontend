import axios from "axios";

import { useAuthStore } from "@/lib/store/auth-store";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getAuthToken = (): string | null => {
  try {
    return useAuthStore.getState().token;
  } catch {
    return null;
  }
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const axiosGet = async <T = any>(
  url: string,
  params?: Record<string, any>
): Promise<{ data: T }> => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          queryParams.append(key, value.toISOString());
        } else if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const queryString = queryParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  const response = await apiClient.get<T>(fullUrl);
  return response;
};

export const axiosPost = async <T = any>(
  url: string,
  data?: any
): Promise<{ data: T }> => {
  const response = await apiClient.post<T>(url, data);
  return response;
};

export const axiosPut = async <T = any>(
  url: string,
  data?: any
): Promise<{ data: T }> => {
  const response = await apiClient.put<T>(url, data);
  return response;
};

export const axiosPatch = async <T = any>(
  url: string,
  data?: any
): Promise<{ data: T }> => {
  const response = await apiClient.patch<T>(url, data);
  return response;
};

export const axiosDelete = async <T = any>(
  url: string
): Promise<{ data: T }> => {
  const response = await apiClient.delete<T>(url);
  return response;
};
