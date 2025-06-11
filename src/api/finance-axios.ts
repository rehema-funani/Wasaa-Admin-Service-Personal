import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://138.68.190.213:3030/api';
const apiKey = import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

const DEBUG_TOKEN_REFRESH = false;

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        try {
          const token = useAuthStore.getState().accessToken;

          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;

            if (DEBUG_TOKEN_REFRESH) {
              config.headers.Authorization = 'Bearer invalid_token_for_testing';
            }
          }

          return config;
        } catch (error) {
          console.error('Error in request interceptor:', error);
          return config;
        }
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (
          error.response &&
          (error.response.status === 401 ||
           (error.response.data &&
            (error.response.data as any).message === "Authorization token invalid or expired!"))
        ) {
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            if (this.isRefreshing) {
              try {
                const newToken = await new Promise<string>((resolve, reject) => {
                  this.addRefreshSubscriber(token => {
                    resolve(token);
                  });
                });

                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return this.instance(originalRequest);
              } catch (refreshError) {
                return Promise.reject(refreshError);
              }
            }

            this.isRefreshing = true;

            try {
              const newToken = await useAuthStore.getState().refreshAuth();

              if (!newToken) {
                throw new Error('Failed to refresh token');
              }

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }

              this.onRefreshed(newToken);
              this.isRefreshing = false;

              return this.instance(originalRequest);
            } catch (refreshError) {
              this.isRefreshing = false;

              useAuthStore.getState().logout();

              return Promise.reject(refreshError);
            }
          }
        }

        if (error.response) {
          const status = error.response.status;
          const responseData = error.response.data as any;

          const errorMessage = responseData?.message || 'An error occurred';
          const errorCode = responseData?.code || String(status);

          const enhancedError = new Error(errorMessage) as Error & {
            status: number;
            code: string;
            responseData: any;
          };

          enhancedError.status = status;
          enhancedError.code = errorCode;
          enhancedError.responseData = responseData;

          return Promise.reject(enhancedError);
        }

        return Promise.reject(error);
      }
    );
  }

  private addRefreshSubscriber(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

export const finance = new ApiClient({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': apiKey
  },
  timeout: 30_000,
});

export default finance.getAxiosInstance();
