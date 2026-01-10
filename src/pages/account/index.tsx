import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileSection from './components/profile-section';
import OrdersSection from './components/orders-section';
import AddressesSection from './components/addresses-section';
import { SessionsSection } from './components/sessions-section';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'sessions'>('profile');

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
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Acceso Denegado</h1>
        <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder a tu cuenta.</p>
        <a
          href="/auth/login"
          className="bg-mint-600 text-white px-6 py-2 rounded hover:bg-mint-700 transition-colors"
        >
          Iniciar Sesión
        </a>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Perfil', icon: '👤' },
    { id: 'orders' as const, label: 'Pedidos', icon: '📦' },
    { id: 'addresses' as const, label: 'Direcciones', icon: '📍' },
    { id: 'sessions' as const, label: 'Sesiones', icon: '🔐' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mi Cuenta</h1>
        <p className="text-gray-600">
          Bienvenido/a de vuelta, {user.first_name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-mint-600 text-lg">
                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-gray-900">
                  {`${user.first_name} ${user.last_name}`}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-mint-50 text-mint-700 border-l-4 border-mint-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {activeTab === 'profile' && <ProfileSection user={user} />}
            {activeTab === 'orders' && <OrdersSection />}
            {activeTab === 'addresses' && <AddressesSection />}
            {activeTab === 'sessions' && <SessionsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
