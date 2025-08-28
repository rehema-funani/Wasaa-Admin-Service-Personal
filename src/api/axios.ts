import axios from "axios";
import {
  TokenStorageType,
  tokenRefreshState,
  getToken,
  refreshAuthToken,
} from "./tokenRefresh";

const baseURL = "http://138.68.190.213:3010/";
const apiKey =
  import.meta.env.VITE_API_KEY ||
  "QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==";

const tokenConfig = {
  apiKey,
  storageType: TokenStorageType.LOCAL_STORAGE,
  authRefreshURL: `${baseURL}auth/refresh-token`,
  includeDeviceId: true,
};

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
  },
  timeout: 30_000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = getToken(tokenConfig.storageType);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;

        if (tokenRefreshState.DEBUG_TOKEN_REFRESH) {
          config.headers.Authorization = "Bearer invalid_token_for_testing";
        }
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

api.interceptors.response.use(
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
            return api(originalRequest);
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

          return api(originalRequest);
        } catch (refreshError) {
          tokenRefreshState.isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
