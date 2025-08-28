import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const DEBUG_TOKEN_REFRESH = false;
const AUTH_REFRESH_URL = "http://138.68.190.213:3010/auth/refresh-token";

export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId =
      "device_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

const addSubscriber = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const handleLogout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userType");
  localStorage.removeItem("source");
  window.location.href = "/auth/login";
};

export const refreshAuthToken = async (apiKey: string): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const userType = "admin";
    const source = "web";

    const response = await axios.post(
      AUTH_REFRESH_URL,
      {
        refresh_token: refreshToken,
        source: source,
        user_type: userType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": apiKey,
          "x-device-id": getDeviceId(),
        },
      }
    );

    if (response.data && response.data.new_access_token) {
      localStorage.setItem("authToken", response.data.new_access_token);

      if (response.data.new_refresh_token) {
        localStorage.setItem("refreshToken", response.data.new_refresh_token);
      }

      return response.data.new_access_token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout();
    throw error;
  }
};

export const applyTokenRefreshInterceptor = (
  axiosInstance: AxiosInstance,
  apiKey: string
): void => {
  axiosInstance.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem("authToken");

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;

          if (DEBUG_TOKEN_REFRESH) {
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

  axiosInstance.interceptors.response.use(
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

          if (isRefreshing) {
            try {
              const newToken = await new Promise<string>((resolve) => {
                addSubscriber((token) => {
                  resolve(token);
                });
              });

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }

          isRefreshing = true;

          try {
            const newToken = await refreshAuthToken(apiKey);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            onRefreshed(newToken);

            isRefreshing = false;

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
