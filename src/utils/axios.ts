import axios from 'axios';
import type * as AxiosTypes from 'axios';

const axiosInstance: AxiosTypes.AxiosInstance = axios.create()

axiosInstance.defaults.withCredentials = true;

// Interceptor to modify request URLs in production
axiosInstance.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api/') && ['production', 'prod'].includes(import.meta.env.VITE_ENV || 'local')) {
    const baseURL = import.meta.env.VITE_CMS_URL || '';
    config.url = baseURL + config.url.replace('/api', '');
  }
  return config;
});

export default axiosInstance;
export type {AxiosTypes};

