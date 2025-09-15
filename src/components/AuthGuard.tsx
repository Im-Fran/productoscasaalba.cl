import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente que protege las rutas de autenticación
 * Redirige a usuarios autenticados fuera de las páginas de login/register
 */
export const AuthGuard = ({ children, redirectTo = '/' }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir cuando no estemos cargando y el usuario esté autenticado
    if (!loading && isAuthenticated) {
      console.log('🔒 Usuario autenticado detectado, redirigiendo a:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  // Mostrar loading mientras verificamos la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin mx-auto h-8 w-8 border-2 border-mint-600 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-sm text-gray-600">Verificando sesión...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, no renderizar nada (la redirección se maneja en useEffect)
  if (isAuthenticated) {
    return null;
  }

  // Si no está autenticado, mostrar el contenido
  return <>{children}</>;
};
