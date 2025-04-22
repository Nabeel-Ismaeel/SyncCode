// src/utils/axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { logout, refreshAccessToken } from '../services/authService';

const instance = axios.create({
  baseURL: 'http://localhost:9090',
});

instance.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isForbidden = error.response?.status === 403;

    if ((isUnauthorized || isForbidden) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        Cookies.set('accessToken', newAccessToken, {
          expires: 1 / 24,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Fix here: The refresh token endpoint returns the token directly
//         const newAccessToken = await refreshAccessToken();
        
//         // Save the new access token correctly
//         Cookies.set('accessToken', newAccessToken, { 
//           expires: 1/24, // 1 hour
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'strict'
//         });
        
//         // Retry the original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return instance(originalRequest);
//       } catch (refreshError) {
//         logout();
//         window.location.href = '/';
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default instance;