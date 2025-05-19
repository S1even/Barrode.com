
import axios from 'axios';


const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


instance.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {
      console.log('Session expirée ou non authentifiée');

    }
    return Promise.reject(error);
  }
);

export default instance;