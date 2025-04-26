import axios from 'axios';



const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // eslint-disable-next-line 
      const refreshToken = localStorage.getItem('refreshToken');
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;