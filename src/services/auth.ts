import axiosInstance from '@/utils/axios';
import type {AuthenticatedUser, UserSession} from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
  turnstile_token?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    display_name: string;
    first_name: string;
    last_name: string;
    roles: string[];
  }
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refresh_token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  payload?: {
    sub: number;
    email: string;
    data: {
      user: {
        id: number;
        email: string;
        display_name: string;
        roles: string[];
      }
    }
  };
  error?: string;
}

export interface GetCurrentUserResponse {
  id: number;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export interface GetSessionsResponse {
  sessions: UserSession[];
}

export interface TurnstileConfigResponse {
  enabled: boolean;
  site_key: string;
}

export interface AuthError {
  code: string;
  message: string;
  data?: {
    status: number;
    retry_after?: number;
  }
}

export class AuthService {
  private static readonly API_BASE_URL = '/api/wp-json/casa-alba/v1/auth';
  private static interceptorsSetup = false;

  /**
   * Limpiar todos los datos de autenticación
   */
  private static clearAuthData(): void {
    localStorage.removeItem('userData');
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  static async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        `${this.API_BASE_URL}/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error('Error en la autenticación. Intenta más tarde.');
      }

      return {
        token: data.token,
        refresh_token: data.refresh_token,
        id: data.user.id,
        email: data.user.email,
        display_name: data.user.display_name,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        roles: data.user.roles,
      };
    } catch (error: any) {
      // Manejar errores específicos de la API
      if (error.response?.data) {
        const authError = error.response.data as AuthError;
        throw new Error(authError.message || 'Error al iniciar sesión');
      }
      throw new Error('Error de conexión. Intenta más tarde.');
    }
  }

  /**
   * Cerrar sesión y revocar el token
   */
  static async logout(): Promise<void> {
    try {
      await axiosInstance.post(
        `${this.API_BASE_URL}/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Refrescar token JWT usando el refresh token
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const savedUserData = localStorage.getItem('userData');
      if (!savedUserData) {
        return false;
      }

      const userData = JSON.parse(savedUserData) as AuthenticatedUser;
      if (!userData.refresh_token) {
        return false;
      }

      const response = await axiosInstance.post<RefreshTokenResponse>(
        `${this.API_BASE_URL}/refresh`,
        {
          refresh_token: userData.refresh_token,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      const data = response.data;
      if (!data.success) {
        return false;
      }

      // Actualizar tokens en localStorage
      const updatedUser = {
        ...userData,
        token: data.token,
        refresh_token: data.refresh_token,
      };

      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }

  /**
   * Validar si un token es válido
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await axiosInstance.post<ValidateTokenResponse>(
        `${this.API_BASE_URL}/validate`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data.valid;
    } catch (error) {
      console.error('Error al validar token:', error);
      return false;
    }
  }

  /**
   * Obtener información del usuario autenticado
   */
  static async getCurrentUser(): Promise<AuthenticatedUser> {
    try {
      const response = await axiosInstance.get<GetCurrentUserResponse>(
        `${this.API_BASE_URL}/me`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const savedUserData = localStorage.getItem('userData');
      if (!savedUserData) {
        throw new Error('No hay datos de autenticación guardados');
      }

      const userData = JSON.parse(savedUserData) as AuthenticatedUser;

      return {
        ...userData,
        id: response.data.id,
        email: response.data.email,
        display_name: response.data.display_name,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        roles: response.data.roles,
      };
    } catch (error: any) {
      if (error.response?.data) {
        const authError = error.response.data as AuthError;
        throw new Error(authError.message || 'Error al obtener datos del usuario');
      }
      throw new Error('Error de conexión. Intenta más tarde.');
    }
  }

  /**
   * Obtener todas las sesiones activas del usuario
   */
  static async getSessions(): Promise<UserSession[]> {
    try {
      const response = await axiosInstance.get<GetSessionsResponse>(
        `${this.API_BASE_URL}/sessions`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data.sessions;
    } catch (error: any) {
      if (error.response?.data) {
        const authError = error.response.data as AuthError;
        throw new Error(authError.message || 'Error al obtener sesiones');
      }
      throw new Error('Error de conexión. Intenta más tarde.');
    }
  }

  /**
   * Revocar una sesión específica
   */
  static async revokeSession(sessionId: number): Promise<void> {
    try {
      await axiosInstance.delete(
        `${this.API_BASE_URL}/sessions/${sessionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (error: any) {
      if (error.response?.data) {
        const authError = error.response.data as AuthError;
        throw new Error(authError.message || 'Error al revocar sesión');
      }
      throw new Error('Error de conexión. Intenta más tarde.');
    }
  }

  /**
   * Revocar todas las sesiones del usuario
   */
  static async revokeAllSessions(keepCurrent: boolean = false): Promise<void> {
    try {
      const url = keepCurrent
        ? `${this.API_BASE_URL}/sessions/all?keep_current=true`
        : `${this.API_BASE_URL}/sessions/all`;

      await axiosInstance.delete(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error: any) {
      if (error.response?.data) {
        const authError = error.response.data as AuthError;
        throw new Error(authError.message || 'Error al revocar sesiones');
      }
      throw new Error('Error de conexión. Intenta más tarde.');
    }
  }

  /**
   * Obtener configuración de Cloudflare Turnstile
   */
  static async getTurnstileConfig(): Promise<TurnstileConfigResponse> {
    try {
      const response = await axiosInstance.get<TurnstileConfigResponse>(
        `${this.API_BASE_URL}/turnstile-key`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.warn('Error al obtener configuración de Turnstile:', error);
      return { enabled: false, site_key: '' };
    }
  }

  /**
   * Configurar interceptors de Axios para manejo automático de tokens
   */
  static setupInterceptors() {
    // Evitar configurar interceptors múltiples veces
    if (this.interceptorsSetup) {
      return;
    }

    // Interceptor para agregar token a las requests
    axiosInstance.interceptors.request.use((config) => {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        return config;
      }

      const authUser = JSON.parse(userData) as AuthenticatedUser;
      if (!authUser || !authUser.token) {
        return config;
      }

      // No agregar token a requests de login, refresh o validate
      const isAuthEndpoint = config.url?.includes('/auth/login') ||
                           config.url?.includes('/auth/refresh') ||
                           config.url?.includes('/auth/validate');

      if (authUser.token && !config.headers.Authorization && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${authUser.token}`;
      }

      return config;
    }, (error) => Promise.reject(error));

    // Interceptor para manejar respuestas y refrescar token si es necesario
    axiosInstance.interceptors.response.use((response) => response, async (error) => {
      const originalRequest = error.config;

      // Solo intentar refresh si:
      // 1. Es un error 401
      // 2. No es un retry (evitar bucles)
      // 3. No es una request de auth (evitar refresh en login/refresh)
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/refresh')
      ) {
        originalRequest._retry = true;

        if (await this.refreshToken()) {
          // Actualizar el token en el header del request original
          const userData = localStorage.getItem('userData');
          if (userData) {
            const authUser = JSON.parse(userData) as AuthenticatedUser;
            originalRequest.headers.Authorization = `Bearer ${authUser.token}`;
          }

          return axiosInstance(originalRequest);
        }

        // Si el refresh falla, limpiar datos y redirigir al login
        this.clearAuthData();
        console.log('No se pudo refrescar el token, redirigiendo a login.');
        if (!window.location.pathname.startsWith('/auth/')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    });

    this.interceptorsSetup = true;
  }

  /**
   * Limpiar interceptors (útil para testing o reinicio)
   */
  static clearInterceptors() {
    this.interceptorsSetup = false;
  }
}
