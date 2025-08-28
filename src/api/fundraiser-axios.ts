import axios from "axios";
import {
  StorageType,
  tokenRefreshUtils,
  getDeviceId,
  TokenRefreshConfig,
} from "./tokenRefresh";

const baseURL = import.meta.env.VITE_API_URL || "http://138.68.190.213:8752/";
const apiKey =
  import.meta.env.VITE_API_KEY ||
  "QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==";

const tokenConfig: TokenRefreshConfig = {
  apiKey,
  storageType: StorageType.LOCAL_STORAGE,
  authRefreshURL: "http://138.68.190.213:3010/auth/refresh-token",
};

export const fundraiser = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
    "x-device-id": getDeviceId(),
  },
  timeout: 30_000,
});

fundraiser.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("authToken");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;

        if (tokenRefreshUtils.DEBUG_TOKEN_REFRESH) {
          config.headers.Authorization = "Bearer invalid_token_for_testing";
        }
      }

      if (config.headers && !config.headers["x-device-id"]) {
        config.headers["x-device-id"] = getDeviceId();
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

fundraiser.interceptors.response.use(
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

        if (tokenRefreshUtils.isRefreshing) {
          try {
            const newToken = await new Promise<string>((resolve, reject) => {
              tokenRefreshUtils.addSubscriber((token) => {
                resolve(token);
              });
            });

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return fundraiser(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        tokenRefreshUtils.isRefreshing = true;

        try {
          const newToken = await tokenRefreshUtils.refreshAuthToken(
            tokenConfig
          );

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          tokenRefreshUtils.onRefreshed(newToken);

          tokenRefreshUtils.isRefreshing = false;

          return fundraiser(originalRequest);
        } catch (refreshError) {
          tokenRefreshUtils.isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

function handleLogout() {
  tokenRefreshUtils.handleLogout(StorageType.LOCAL_STORAGE);
}

export default fundraiser;
