import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router';

export default function AccountSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { id: 'profile', label: 'Perfil', icon: '👤', path: '/cuenta' },
    { id: 'orders', label: 'Pedidos', icon: '📦', path: '/pedidos' },
    { id: 'addresses', label: 'Direcciones', icon: '📍', path: '/cuenta?tab=addresses' },
    { id: 'sessions', label: 'Sesiones', icon: '🔐', path: '/cuenta?tab=sessions' },
  ];

  const isActive = (path: string) => {
    if (path === '/cuenta') {
      return location.pathname === '/cuenta' && !location.search.includes('tab=');
    }
    if (path === '/pedidos') {
      return location.pathname === '/pedidos';
    }
    if (path.includes('tab=addresses')) {
      return location.search.includes('tab=addresses');
    }
    if (path.includes('tab=sessions')) {
      return location.search.includes('tab=sessions');
    }
    return false;
  };

  return (
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
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
              isActive(item.path)
                ? 'bg-mint-50 text-mint-700 border-l-4 border-mint-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

