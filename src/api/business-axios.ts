import axios from 'axios';
import {
    TokenStorageType,
    tokenRefreshState,
    getToken,
    refreshAuthToken,
} from "./tokenRefresh";

const apiKey =
  import.meta.env.VITE_API_KEY ||
  "QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==";

const tokenConfig = {
  apiKey,
  storageType: TokenStorageType.LOCAL_STORAGE,
  authRefreshURL: "http://138.68.190.213:3010/auth/refresh-token",
  includeDeviceId: false, // Assuming business service doesn't need deviceId
};

export const businessApi = axios.create({
    baseURL: 'http://138.68.190.213:3020/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
    },
    timeout: 30_000,
});

businessApi.interceptors.request.use(
  (config) => {
    try {
      const token = getToken(tokenConfig.storageType);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

businessApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.data &&
          error.response.data.message ===
            "Authorization token invalid or expired!"))
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (tokenRefreshState.isRefreshing) {
          try {
            const newToken = await new Promise<string>((resolve) => {
              tokenRefreshState.addSubscriber((token) => {
                resolve(token);
              });
            });

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return businessApi(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        tokenRefreshState.isRefreshing = true;

        try {
          const newToken = await refreshAuthToken(tokenConfig);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          tokenRefreshState.onRefreshed(newToken);
          tokenRefreshState.isRefreshing = false;
          return businessApi(originalRequest);
        } catch (refreshError) {
          tokenRefreshState.isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }
    }

        return Promise.reject(error);
    }
);
