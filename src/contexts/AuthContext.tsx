import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulación de verificación de token
          const mockUser: User = {
            id: 1,
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            role: 'customer'
          };
          setUser(mockUser);
        }
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string, rememberMe = false) => {
    setLoading(true);
    try {
      // Simulación de respuesta de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse = {
        user: {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: email,
          role: 'customer'
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      };

      localStorage.setItem('authToken', mockResponse.token);
      if (rememberMe) {
        localStorage.setItem('refreshToken', mockResponse.refreshToken);
      }

      setUser(mockResponse.user);
    } catch {
      throw new Error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      // Simulación de respuesta de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse = {
        user: {
          id: 2,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: 'customer'
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      };

      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);

      setUser(mockResponse.user);
    } catch {
      throw new Error('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const forgotPassword = async (_email: string) => {
    try {
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {
      throw new Error('Error al enviar el correo de recuperación');
    }
  };

  const resetPassword = async (_token: string, _email: string, _password: string) => {
    try {
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {
      throw new Error('Error al restablecer la contraseña');
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
