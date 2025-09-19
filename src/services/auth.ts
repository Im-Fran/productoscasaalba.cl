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
  private static isRefreshing = false; // Flag para evitar múltiples intentos simultáneos
  private static refreshFailed = false; // Flag para marcar cuando ya falló el refresh

  /**
   * Manejar errores específicos de JWT AUTH
   */
  private static handleJWTError(error: any): never {
    if (error?.response?.data) {
      const { code, message } = error.response.data;

      switch (code) {
        case 'jwt_auth_invalid_token':
          throw new Error('Token inválido. Por favor, inicia sesión nuevamente.');
        case 'jwt_auth_expired_token':
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        case 'jwt_auth_obsolete_refresh_token':
          // Limpiar datos y forzar nuevo login
          this.clearAuthData();
          throw new Error('Tu sesión ha caducado. Por favor, inicia sesión nuevamente.');
        case 'jwt_auth_no_auth_header':
          throw new Error('Falta el header de autorización.');
        case 'jwt_auth_bad_auth_header':
          throw new Error('Header de autorización mal formado.');
        case 'jwt_auth_bad_config':
          throw new Error('Error de configuración del servidor. Contacta al administrador.');
        case 'jwt_auth_bad_iss':
          throw new Error('Token inválido: emisor incorrecto.');
        case 'jwt_auth_bad_aud':
          throw new Error('Token inválido: audiencia incorrecta.');
        case 'jwt_auth_user_not_found':
          throw new Error('Usuario no encontrado.');
        case 'jwt_auth_invalid_username':
          throw new Error('Nombre de usuario o contraseña incorrectos.');
        case 'jwt_auth_invalid_password':
          throw new Error('Nombre de usuario o contraseña incorrectos.');
        case 'jwt_auth_account_not_activated':
          throw new Error('Tu cuenta no está activada. Revisa tu email para activarla.');
        case 'jwt_auth_invalid_email':
          throw new Error('Email inválido.');
        case 'jwt_auth_no_refresh_token':
          throw new Error('No se encontró el token de actualización.');
        case 'jwt_auth_invalid_refresh_token':
          // Limpiar datos y forzar nuevo login
          this.clearAuthData();
          throw new Error('Token de actualización inválido. Por favor, inicia sesión nuevamente.');
        default:
          // Si hay un mensaje personalizado, usarlo
          if (message) {
            throw new Error(message);
          }
          throw new Error('Error de autenticación desconocido.');
      }
    }

    // Error sin estructura específica
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }

  /**
   * Limpiar todos los datos de autenticación
   */
  private static clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.refreshFailed = false; // Resetear el flag al limpiar datos
    this.isRefreshing = false; // Resetear el flag de refreshing
    // Limpiar cookie manualmente si existe
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
  }

  /**
   * Obtener token JWT
   */
  static async login(credentials: LoginCredentials): Promise<JWTResponse> {
    try {
      const response = await axiosInstance.post(`${this.JWT_BASE_URL}/token`, credentials, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (error: unknown) {
      this.handleJWTError(error);
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

      // Si es un error específico de JWT, manejarlo apropiadamente
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: string } } };
        if (axiosError.response?.data?.code?.startsWith('jwt_auth_')) {
          // Para validación, solo retornar false en lugar de lanzar error
          if (['jwt_auth_invalid_token', 'jwt_auth_expired_token', 'jwt_auth_obsolete_refresh_token'].includes(axiosError.response.data.code)) {
            return false;
          }
        }
      }

      return false;
    }
  }

  /**
   * Refrescar token JWT usando la refresh_token guardada
   */
  static async refreshToken(): Promise<string> {
    // Si ya falló previamente, no intentar de nuevo
    if (this.refreshFailed) {
      throw new Error('El refresh token ya falló anteriormente. Inicia sesión nuevamente.');
    }

    // Si ya hay un refresh en progreso, esperar
    if (this.isRefreshing) {
      throw new Error('Ya hay un refresh en progreso.');
    }

    this.isRefreshing = true;

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
      this.isRefreshing = false;
      return data.token;
    } catch (error: unknown) {
      console.error('Error al refrescar token:', error);
      this.isRefreshing = false;
      this.refreshFailed = true; // Marcar como fallido para evitar futuros intentos

      // Manejar errores específicos de refresh token
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: string } } };
        const errorCode = axiosError.response?.data?.code;

        // Si el refresh token está obsoleto o es inválido, limpiar datos
        if (errorCode === 'jwt_auth_obsolete_refresh_token' ||
            errorCode === 'jwt_auth_invalid_refresh_token' ||
            errorCode === 'jwt_auth_no_refresh_token') {
          this.clearAuthData();
        }
      }

      this.handleJWTError(error);
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
      this.clearAuthData();
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

        // Solo intentar refresh si:
        // 1. Es un error 401
        // 2. No es un retry (evitar bucles)
        // 3. No es una request de auth (evitar refresh en login/refresh)
        // 4. No ha fallado previamente el refresh
        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/jwt-auth/') &&
            !this.refreshFailed) {

          originalRequest._retry = true;

          try {
            console.log('Intentando refrescar token...');
            const newToken = await this.refreshToken();
            localStorage.setItem('authToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log('Token refrescado exitosamente, reintentando petición original');
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, eliminar tokens y redirigir al login
            console.error('Error al refrescar token, redirigiendo al login:', refreshError);
            this.clearAuthData();

            // Solo redirigir si no estamos ya en una página de auth
            if (!window.location.pathname.startsWith('/auth/')) {
              window.location.href = '/auth/login';
            }

            return Promise.reject(refreshError);
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
