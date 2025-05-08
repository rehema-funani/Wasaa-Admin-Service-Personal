import axios from 'axios';
import Cookies from 'js-cookie';
const baseURL = import.meta.env.VITE_API_URL || 'http://138.68.190.213:3010/';
const apiKey = import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': apiKey
  },
  timeout: 30_000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = Cookies.get('authToken');
      console.log(token);
      
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

