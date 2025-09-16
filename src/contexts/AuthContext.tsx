import { createContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { AuthService } from '@/services/auth';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  nicename?: string;
  displayName?: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  // Configurar interceptors al montar el componente
  useEffect(() => {
    if (!hasInitialized.current) {
      AuthService.setupInterceptors();
      hasInitialized.current = true;
    }
  }, []);

  // Verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      if (hasInitialized.current) return; // Evitar múltiples ejecuciones

      console.log('🔍 Checking authentication...');

      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        console.log('📋 Auth data found:', {
          hasToken: !!token,
          hasUserData: !!userData,
          tokenLength: token?.length || 0
        });

        if (token && userData) {
          console.log('🔑 Validating token...');
          const isValid = await AuthService.validateToken(token);

          console.log('✅ Token validation result:', isValid);

          if (isValid) {
            // Si el token es válido, restaurar datos del usuario
            try {
              const parsedUserData = JSON.parse(userData);
              console.log('👤 Restoring user session:', parsedUserData.email);
              setUser(parsedUserData);
            } catch (parseError) {
              console.error('❌ Error parsing user data:', parseError);
              // Si hay error al parsear, limpiar todo
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userData');
            }
          } else {
            console.log('🗑️ Token invalid, clearing storage');
            // Token inválido, limpiar storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
          }
        } else {
          console.log('ℹ️ No authentication data found');
        }
      } catch (error) {
        console.error('❌ Error during auth check:', error);
        // En caso de error, limpiar todo por seguridad
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      } finally {
        console.log('✅ Auth check completed, setting loading to false');
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await AuthService.login({
        username: email,
        password: password
      });

      // Crear objeto usuario basado en la nueva estructura de respuesta JWT
      const userData: User = {
        id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: 'customer', // WordPress JWT no retorna role, usar default
        nicename: response.data.nicename,
        displayName: response.data.displayName
      };

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(userData));

      if (rememberMe) {
        localStorage.setItem('refreshToken', response.data.token);
      }

      setUser(userData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Credenciales inválidas';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (_userData: RegisterData) => {
    setLoading(true);
    try {
      // WordPress JWT no incluye registro por defecto
      // Esto necesitaría un endpoint personalizado o plugin adicional
      throw new Error('El registro de usuarios no está implementado en este sistema');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const forgotPassword = async (_email: string) => {
    try {
      // WordPress JWT no incluye reset de password por defecto
      // Esto necesitaría funcionalidad adicional
      throw new Error('La recuperación de contraseña no está implementada en este sistema');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el correo de recuperación';
      throw new Error(errorMessage);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetPassword = async (_token: string, _email: string, _password: string) => {
    try {
      // WordPress JWT no incluye reset de password por defecto
      throw new Error('El restablecimiento de contraseña no está implementada en este sistema');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al restablecer la contraseña';
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
