import { createContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { AuthService } from '@/services/auth';
import type {AuthenticatedUser} from "@/types/user";

export type AuthContextType = {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
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
      try {
        const userData = localStorage.getItem('userData');
        const authenticatedUser = userData ? JSON.parse(userData) as AuthenticatedUser : null;

        if (!authenticatedUser) {
          throw new Error('No se ha encontrado usuario autenticado');
        }

        const isValid = await AuthService.validateToken(authenticatedUser.token);

        if (!isValid) {
          throw new Error('Token inválido o expirado');
        }

        setUser(authenticatedUser)
      } catch (error) {
        console.error('❌ Error during auth check:', error);
        localStorage.removeItem('userData');
      } finally {
        console.log('✅ Auth check completed, setting loading to false');
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await AuthService.login({email, password});
      localStorage.setItem('userData', JSON.stringify(userData));
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
      // Registrar mediante JWT-auth
      throw new Error('El registro de usuarios no está implementado en este sistema');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Usar el método logout del AuthService que maneja la limpieza completa
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error durante logout:', error);
      localStorage.removeItem('userData');
      setUser(null);
    } finally {
      setLoading(false);
    }
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
