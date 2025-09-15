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
      const response = await axiosInstance.post(`${this.JWT_BASE_URL}/token`, credentials);
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
      const response = await axiosInstance.post(
        `${this.JWT_BASE_URL}/token/validate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // La validación puede tener diferentes estructuras de respuesta
      const data = response.data;

      // Verificar diferentes posibles estructuras de respuesta
      if (data.code) {
        return data.code === 'jwt_auth_valid_token';
      }

      if (data.success !== undefined) {
        return data.success === true;
      }

      // Si no hay estructura específica, considerar que response 200 = válido
      return response.status === 200;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Refrescar token JWT
   */
  static async refreshToken(token: string): Promise<string> {
    try {
      const response = await axiosInstance.post(
        `${this.JWT_BASE_URL}/token/refresh`,
        `refresh_token=${encodeURIComponent(token)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: RefreshResponse = response.data;
      return data.token;
    } catch (error: unknown) {
      console.log({ method: 'refreshToken', error })
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
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) {
              const newToken = await this.refreshToken(currentToken);
              localStorage.setItem('authToken', newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            }
          } catch {
            // Si el refresh falla, eliminar tokens y redirigir al login
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
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
