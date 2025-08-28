import axios from "axios";
import Cookies from "js-cookie";

// Types
export enum StorageType {
  LOCAL_STORAGE,
  COOKIES,
}

export interface TokenRefreshConfig {
  apiKey: string;
  storageType: StorageType;
  authRefreshURL?: string;
}

// State to be shared across all instances
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const DEBUG_TOKEN_REFRESH = false;

// Helper functions
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

export const addSubscriber = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

export const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const handleLogout = (storageType: StorageType): void => {
  if (storageType === StorageType.LOCAL_STORAGE) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("source");
  } else {
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    Cookies.remove("userType");
    Cookies.remove("source");
  }
  window.location.href = "/auth/login";
};

export const refreshAuthToken = async (
  config: TokenRefreshConfig
): Promise<string> => {
  try {
    let refreshToken: string | null;

    if (config.storageType === StorageType.LOCAL_STORAGE) {
      refreshToken = localStorage.getItem("refreshToken");
    } else {
      refreshToken = Cookies.get("refreshToken") || null;
    }

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const userType = "admin";
    const source = "web";
    const authRefreshURL =
      config.authRefreshURL || "http://138.68.190.213:3010/auth/refresh-token";

    const response = await axios.post(
      authRefreshURL,
      {
        refresh_token: refreshToken,
        source: source,
        user_type: userType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": config.apiKey,
          "x-device-id": getDeviceId(),
        },
      }
    );

    if (response.data && response.data.new_access_token) {
      if (config.storageType === StorageType.LOCAL_STORAGE) {
        localStorage.setItem("authToken", response.data.new_access_token);
        if (response.data.new_refresh_token) {
          localStorage.setItem("refreshToken", response.data.new_refresh_token);
        }
      } else {
        Cookies.set("authToken", response.data.new_access_token);
        if (response.data.new_refresh_token) {
          Cookies.set("refreshToken", response.data.new_refresh_token);
        }
      }
      return response.data.new_access_token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout(config.storageType);
    throw error;
  }
};

// Export variables to be used by the original files
export const tokenRefreshUtils = {
  isRefreshing,
  refreshSubscribers,
  DEBUG_TOKEN_REFRESH,
  getDeviceId,
  addSubscriber,
  onRefreshed,
  refreshAuthToken,
  handleLogout,
};
