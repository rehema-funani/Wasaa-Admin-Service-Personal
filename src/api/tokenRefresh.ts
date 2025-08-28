import axios from "axios";
import Cookies from "js-cookie";

export enum TokenStorageType {
  LOCAL_STORAGE,
  COOKIES,
  MIXED,
}

export interface TokenRefreshConfig {
  apiKey: string;
  storageType: TokenStorageType;
  authRefreshURL: string;
  includeDeviceId?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const DEBUG_TOKEN_REFRESH = false;

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

export const getToken = (storageType: TokenStorageType): string | null => {
  switch (storageType) {
    case TokenStorageType.LOCAL_STORAGE:
      return localStorage.getItem("authToken");
    case TokenStorageType.COOKIES:
      return Cookies.get("authToken") || null;
    case TokenStorageType.MIXED:
      return (
        localStorage.getItem("authToken") || Cookies.get("authToken") || null
      );
    default:
      return null;
  }
};

export const handleLogout = (storageType: TokenStorageType): void => {
  if (
    storageType === TokenStorageType.LOCAL_STORAGE ||
    storageType === TokenStorageType.MIXED
  ) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("source");
  }

  if (
    storageType === TokenStorageType.COOKIES ||
    storageType === TokenStorageType.MIXED
  ) {
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
    let refreshToken: string | null = null;

    switch (config.storageType) {
      case TokenStorageType.LOCAL_STORAGE:
        refreshToken = localStorage.getItem("refreshToken");
        break;
      case TokenStorageType.COOKIES:
        refreshToken = Cookies.get("refreshToken") || null;
        break;
      case TokenStorageType.MIXED:
        refreshToken =
          localStorage.getItem("refreshToken") ||
          Cookies.get("refreshToken") ||
          null;
        break;
    }

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const userType = "admin";
    const source = "web";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": config.apiKey,
    };

    if (config.includeDeviceId) {
      headers["x-device-id"] = getDeviceId();
    }

    const response = await axios.post(
      config.authRefreshURL,
      {
        refresh_token: refreshToken,
        source: source,
        user_type: userType,
      },
      { headers }
    );

    if (response.data && response.data.new_access_token) {
      const newToken = response.data.new_access_token;

      switch (config.storageType) {
        case TokenStorageType.LOCAL_STORAGE:
          localStorage.setItem("authToken", newToken);
          if (response.data.new_refresh_token) {
            localStorage.setItem(
              "refreshToken",
              response.data.new_refresh_token
            );
          }
          break;
        case TokenStorageType.COOKIES:
          Cookies.set("authToken", newToken);
          if (response.data.new_refresh_token) {
            Cookies.set("refreshToken", response.data.new_refresh_token);
          }
          break;
        case TokenStorageType.MIXED:
          localStorage.setItem("authToken", newToken);
          if (response.data.new_refresh_token) {
            localStorage.setItem(
              "refreshToken",
              response.data.new_refresh_token
            );
          }
          break;
      }

      return newToken;
    } else if (response.data && response.data.token) {
      const newToken = response.data.token;

      switch (config.storageType) {
        case TokenStorageType.LOCAL_STORAGE:
          localStorage.setItem("authToken", newToken);
          break;
        case TokenStorageType.COOKIES:
          Cookies.set("authToken", newToken);
          break;
        case TokenStorageType.MIXED:
          localStorage.setItem("authToken", newToken);
          break;
      }

      return newToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout(config.storageType);
    throw error;
  }
};

export const tokenRefreshState = {
  isRefreshing,
  refreshSubscribers,
  DEBUG_TOKEN_REFRESH,
  addSubscriber,
  onRefreshed,
};
