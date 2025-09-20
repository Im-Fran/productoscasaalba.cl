import axios from 'axios';
import type * as AxiosTypes from 'axios';
import {buildWebStorage, setupCache} from "axios-cache-interceptor";

const instance: AxiosTypes.AxiosInstance = axios.create({
  // Configuración por defecto para cookies
  withCredentials: true,
  // Headers adicionales para CORS
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
  }
});

const axiosInstance = setupCache(instance, {
  storage: buildWebStorage(localStorage, 'axios-cache:'),
  ttl: 5 * 60 * 1000, // Tiempo de vida del cache en milisegundos (5 minutos)
})

// Variable global para almacenar el callback de mantenimiento
let maintenanceCallback: ((isActive: boolean) => void) | null = null;

// Función para registrar el callback de mantenimiento
export const setMaintenanceCallback = (callback: (isActive: boolean) => void) => {
  maintenanceCallback = callback;
};

// Interceptor to modify request URLs in production
axiosInstance.interceptors.request.use((config) => {
  // Asegurar que withCredentials esté siempre habilitado
  config.withCredentials = true;

  if (config.url && config.url.startsWith('/api/') && ['production', 'prod'].includes(import.meta.env.VITE_ENV || 'local')) {
    const baseURL = import.meta.env.VITE_CMS_URL || '';
    config.url = baseURL + config.url.replace('/api', '');
  }

  return config;
});

// Interceptor para detectar modo de mantenimiento
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, salir del modo mantenimiento
    if (maintenanceCallback && response.config.url?.includes('/wp-json/')) {
      maintenanceCallback(false);
    }
    return response;
  },
  (error) => {
    // Verificar si es un error 503 en una URL de wp-json
    if (
      error.response?.status === 503 &&
      error.config?.url?.includes('/wp-json/') &&
      typeof error.response.data === 'string' &&
      error.response.data.includes('<title>Maintenance</title>')
    ) {
      // Activar modo mantenimiento
      if (maintenanceCallback) {
        maintenanceCallback(true);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export type {AxiosTypes};
