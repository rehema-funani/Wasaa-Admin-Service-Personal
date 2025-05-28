import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_API_URL || 'http://138.68.190.213:3010/';
const apiKey = import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const DEBUG_TOKEN_REFRESH = false;

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const refreshAuthToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const userType = 'admin';
    const source = 'web';
    
    const response = await axios.post(`${baseURL}auth/refresh-token`, {
      refresh_token: refreshToken,
      source: source,
      user_type: userType
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': apiKey
      }
    });
    
    if (response.data && response.data.new_access_token) {
      Cookies.set('authToken', response.data.new_access_token);
      
      if (response.data.new_refresh_token) {
        Cookies.set('refreshToken', response.data.new_refresh_token);
      }
      
      return response.data.token;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    handleLogout();
    throw error;
  }
};

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
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        
        if (DEBUG_TOKEN_REFRESH) {
          config.headers.Authorization = 'Bearer invalid_token_for_testing';
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
        error.response.data.message === "Authorization token invalid or expired!"))
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        if (isRefreshing) {
          try {
            const newToken = await new Promise<string>((resolve, reject) => {
              addSubscriber(token => {
                resolve(token);
              });
            });
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        
        isRefreshing = true;
        
        try {
          const newToken = await refreshAuthToken();
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          onRefreshed(newToken);
          
          isRefreshing = false;
          
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

function handleLogout() {
  Cookies.remove('authToken');
  Cookies.remove('refreshToken');
  Cookies.remove('user');
  Cookies.remove('userType');
  Cookies.remove('source');
  window.location.href = '/auth/login';
}

export default api;