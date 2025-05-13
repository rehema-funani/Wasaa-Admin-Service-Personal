import axios from 'axios';
import Cookies from 'js-cookie';
const baseURL = import.meta.env.VITE_API_URL || 'http://138.68.190.213:5001/api/v1/';
const apiKey = import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

export const logsaudit = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': apiKey
  },
  timeout: 30_000,
});

logsaudit.interceptors.request.use(
  (config) => {
    try {
      const token = Cookies.get('authToken');
      
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


logsaudit.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      handleLogout();
    }
    
    if (error.response && 
        error.response.data && 
        error.response.data.message === "Authorization token invalid or expired!") {
      handleLogout();
    }
    
    return Promise.reject(error);
  }
);

function handleLogout() {
  Cookies.remove('authToken');
  Cookies.remove('user');

  window.location.href = '/auth/login';
}