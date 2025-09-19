import axiosInstance from '@/utils/axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JWTResponse {
  success: boolean;
  statusCode: number;
  code: string;
  message: string;
  data: {
    token: string;
    id: number;
    email: string;
    nicename: string;
    firstName: string;
    lastName: string;
    displayName: string;
  };
}

export interface ValidationResponse {
  code: string;
  data: {
    status: number;
  };
}

export interface RefreshResponse {
  token: string;
}

export class AuthService {
  private static readonly JWT_BASE_URL = '/api/wp-json/jwt-auth/v1';
  private static interceptorsSetup = false;

  /**
   * Obtener token JWT
   */
  static async login(credentials: LoginCredentials): Promise<JWTResponse> {
    try {
      const response = await axiosInstance.post(`${this.JWT_BASE_URL}/token`, credentials, {
        withCredentials: true, // Permitir cookies
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Error al iniciar sesión');
    }
  }

  /**
   * Validar token JWT
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axiosInstance.post(
        `${this.JWT_BASE_URL}/token/validate`,
        {},
        {
          withCredentials: true,
          headers,
        }
      );

      const data = response.data;

      if (data.code) {
        return data.code === 'jwt_auth_valid_token';
      }

      if (data.success !== undefined) {
        return data.success === true;
      }

      return response.status === 200;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Refrescar token JWT usando la refresh_token guardada
   */
  static async refreshToken(): Promise<string> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const response = await axiosInstance.post(
        `${this.JWT_BASE_URL}/token/refresh`,
        {},
        {
          withCredentials: true,
          headers,
        }
      );

      const data: RefreshResponse = response.data;
      return data.token;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Error al refrescar el token');
    }
  }

  /**
   * Cerrar sesión y limpiar cookies
   */
  static async logout(): Promise<void> {
    try {
      await axiosInstance.post(`${this.JWT_BASE_URL}/token/revoke`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.warn('Endpoint de revoke no disponible:', error);
    } finally {
      // Limpiar datos locales
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }

  /**
   * Configurar interceptor para agregar token automáticamente
   */
  static setupInterceptors() {
    // Evitar configurar interceptors múltiples veces
    if (this.interceptorsSetup) {
      return;
    }

    // Interceptor para agregar token a las requests
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Asegurar que las cookies se envíen en requests de auth
        if (config.url?.includes('/jwt-auth/')) {
          config.withCredentials = true;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas y refrescar token si es necesario
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar refrescar el token usando la cookie refresh_token
            const newToken = await this.refreshToken();
            localStorage.setItem('authToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, eliminar tokens y redirigir al login
            console.error('Error al refrescar token:', refreshError);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

            // Solo redirigir si no estamos ya en una página de auth
            if (!window.location.pathname.startsWith('/auth/')) {
              window.location.href = '/auth/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );

    this.interceptorsSetup = true;
  }

  /**
   * Limpiar interceptors (útil para testing o reinicio)
   */
  static clearInterceptors() {
    this.interceptorsSetup = false;
  }
}
