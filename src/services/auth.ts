import axiosInstance from '@/utils/axios';
import type {AuthenticatedUser} from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthenticateResponse {
  success: boolean;
  data: {
    jwt: string;
  }
}

export type ValidateTokenResponse = {
  success: boolean;
  data: {
    user: {
      ID: string;
      user_login: string;
      user_email: string;
      user_nicename: string;
      user_url: string;
      user_registered: string;
      user_activation_key: string;
      user_status: string;
      display_name: string;
    },
    roles: string[],
    jwt: [{
      token: string;
      header: {
        typ: string;
        alg: string;
      },
      payload: {
        iat: number;
        exp: number;
        email: string;
        id: number;
        site: string;
        username: string;
        iss: string;
      },
      expire_in: number;
    }]
  }
}

export interface JWTError {
  success: boolean;
  data: {
    message: string;
    errorCode: string;
  }
}

export interface AuthenticationError {
  error: string;
}

export class AuthService {
  private static readonly JWT_BASE_URL = '/api/wp-json/jwt-auth/v1';
  private static interceptorsSetup = false;

  /**
   * Limpiar todos los datos de autenticación
   */
  private static clearAuthData(): void {
    localStorage.removeItem('userData');
  }

  /**
   * Genera un token de JWT y retorna los datos del usuario autenticado
   */
  static async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const response = await axiosInstance.post(`${this.JWT_BASE_URL}/auth`, credentials, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data: AuthenticateResponse = response.data
    if(!data.success) {
      throw new Error('Error en la autenticación. Intenta más tarde.');
    }

    const token = data.data.jwt

    const userResponse = await axiosInstance.get(`/api/wp-json/wp/v2/users/me?_fields=id,name,email,first_name,last_name&context=edit`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if(userResponse.status != 200) {
      throw new Error('Error al obtener datos del usuario. Intenta más tarde.');
    }

    return {
      token,
      ...userResponse.data,
    };
  }

  /**
   * Validar token JWT
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await axiosInstance.post(`${this.JWT_BASE_URL}/auth/validate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data: ValidateTokenResponse = response.data;
      if(!data.success) {
        return false;
      }

      const savedUserData = localStorage.getItem('userData');
      if(!savedUserData) {
        return false;
      }

      const savedUser: AuthenticatedUser = JSON.parse(savedUserData);
      return !(`${savedUser.id}` !== data.data.user.ID || savedUser.email !== data.data.user.user_email);
    } catch (e: unknown) {
      console.error('Error al validar token:', e);
    }

    return false;
  }

  /**
   * Refrescar token JWT usando la refresh_token guardada
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const savedUserData = localStorage.getItem('userData');
      if(!savedUserData) {
        return false;
      }

      const userData = JSON.parse(savedUserData) as AuthenticatedUser;
      if(!userData.token) {
        return false;
      }

      const response = await axiosInstance.post(`${this.JWT_BASE_URL}/auth/refresh`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        }
      });

      const data: AuthenticateResponse = response.data;
      if(!data.success) {
        return false;
      }

      const newToken = data.data.jwt;
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        token: newToken,
      }));

      return true;
    } catch (e: unknown) {
      console.error('Error al refrescar token:', e);
    }

    return false;
  }

  /**
   * Cerrar sesión y limpiar cookies
   */
  static async logout(): Promise<void> {
    try {
      await axiosInstance.post(`${this.JWT_BASE_URL}/auth/revoke`, {
        'JWT': localStorage.getItem('authToken') || '',
      }, {
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
    axiosInstance.interceptors.request.use((config) => {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        return config;
      }

      const authUser = JSON.parse(userData) as AuthenticatedUser;
      if (!authUser || !authUser.token) {
        return config;
      }

      if (authUser.token && !config.headers.Authorization) {
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
      if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/jwt-auth/')) {
        originalRequest._retry = true;
        if (await this.refreshToken()) {
          return axiosInstance(originalRequest);
        }

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
