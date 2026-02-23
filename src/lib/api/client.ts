import axios, { AxiosError } from "axios";

import { useAuthStore } from "@/lib/store/auth-store";

const getBaseUrl = (): string => {
  // Use same-origin /api so Next.js rewrites proxy to the backend (avoids CORS and network errors)
  if (typeof window !== "undefined") {
    return "/api";
  }
  // Server-side: call backend directly so rewrites are not used for SSR
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return url.replace(/\/$/, "");
};

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
  timeout: 30000,
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    // Make "Network Error" more actionable (often CORS or backend unreachable)
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      const base = apiClient.defaults.baseURL || "unknown";
      const url = error.config?.url ? `${base}${error.config.url}` : base;
      const hint =
        "Check that the API is running, NEXT_PUBLIC_API_URL is correct, and the backend allows your origin (CORS).";
      Object.assign(error, {
        message: `Network Error calling ${url}. ${hint}`,
      });
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
