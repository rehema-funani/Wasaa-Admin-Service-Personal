import axios from "axios";
import Cookies from "js-cookie";

const AUTH_REFRESH_URL = "http://138.68.190.213:3010/auth/refresh-token";

export enum TokenStorageType {
  LOCAL_STORAGE,
  COOKIES,
  MIXED,
}

export interface TokenRefreshConfig {
  apiKey: string;
  storageType: TokenStorageType;
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
  const localToken = localStorage.getItem("authToken");
  if (localToken) return localToken;

  switch (storageType) {
    case TokenStorageType.LOCAL_STORAGE:
      return null; 
    case TokenStorageType.COOKIES:
      return Cookies.get("authToken") || null;
    case TokenStorageType.MIXED:
      return Cookies.get("authToken") || null;
    default:
      return null;
  }
};

export const handleLogout = (): void => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("userType");
  //   window.location.href = "/auth/login";
};

export const refreshAuthToken = async (
  config: TokenRefreshConfig
): Promise<string> => {
  try {
    let refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      switch (config.storageType) {
        case TokenStorageType.COOKIES:
          refreshToken = Cookies.get("refreshToken") || null;
          break;
        case TokenStorageType.MIXED:
          refreshToken = Cookies.get("refreshToken") || null;
          break;
      }
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
      AUTH_REFRESH_URL,
      {
        refresh_token: refreshToken,
        source: source,
        user_type: userType,
      },
      { headers }
    );
    const newToken = response.data.new_access_token;

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("refreshToken", response.data.new_refresh_token);
    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout();
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
