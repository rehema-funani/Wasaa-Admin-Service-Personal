import axios from "axios";
import { applyTokenRefreshInterceptor, getDeviceId } from "./tokenRefresh";

const baseURL =
  import.meta.env.VITE_API_URL || "http://138.68.190.213:3030/api";
const apiKey =
  import.meta.env.VITE_API_KEY ||
  "QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==";

export const finance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
    "x-device-id": getDeviceId(),
  },
  timeout: 30_000,
});

applyTokenRefreshInterceptor(finance, apiKey);

export default finance;
