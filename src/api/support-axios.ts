import axios from "axios";
import { TokenStorageType, getToken, handleLogout } from "./tokenRefresh";

const baseURL = "http://138.68.190.213:4003/api/v1/";
const apiKey =
  import.meta.env.VITE_API_KEY ||
  "QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==";

const storageType = TokenStorageType.MIXED;

const supportaxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // 'x-api-key': apiKey 
  },
  timeout: 30_000,
});

supportaxios.interceptors.request.use(
  (config) => {
    try {
      const token = getToken(storageType);

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

supportaxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      handleLogout();
    }

    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Authorization token invalid or expired!"
    ) {
      handleLogout();
    }

    return Promise.reject(error);
  }
);

export default supportaxios;
