import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';
import OrdersSection from '@/pages/account/components/orders-section';
import AccountSidebar from '@/pages/account/components/account-sidebar';

export default function OrdersPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mis Pedidos</h1>
        <p className="text-gray-600">
          Consulta el estado de tus pedidos actuales y pasados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <AccountSidebar />
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <OrdersSection />
          </div>
        </div>
      </div>
    </div>
  );
}

