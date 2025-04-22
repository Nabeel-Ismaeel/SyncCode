import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:9090/auth';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');
  
  const response = await axios.get('http://localhost:9090/refreshToken/generateToken', {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  });
  return response.data;
};

export const logout = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};