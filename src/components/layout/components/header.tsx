import {Link} from "react-router";
import CasaAlbaLogo from "@/assets/casaalba.webp";
import {ShoppingBag, User, LogOut, ChevronDown} from "lucide-react";
import { useState } from "react";
import {useCart} from "@/hooks/useCart";
import {useAuth} from "@/hooks/useAuth";

interface HeaderProps {
  onCartClick: () => void;
}

export const Header = ({ onCartClick }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error durante logout:', error);
      // En caso de error, cerrar el menú de todas formas
      setUserMenuOpen(false);
    }
  };

  return (
    <header className={"bg-white shadow-sm border-b border-gray-200"}>
      <div className="container mx-auto">
        {/* Top section with logo and icons */}
        <div className="flex items-center justify-center gap-2.5 py-4">
          <Link
            to={"/"}
            className="w-full h-24"
            style={{
              backgroundImage: `url(${CasaAlbaLogo})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: '86px auto',
              backgroundPosition: 'center',
              backgroundOrigin: 'content-box',
              paddingLeft: '86px',
              paddingRight: '86px',
            }}
          />

          <div className={"ml-auto flex items-center mx-4 gap-4"}>
            <button onClick={onCartClick} className="relative">
              <ShoppingBag
                size={24}
                className={"text-gray-600 hover:text-gray-900"}
              />
              {cart && cart.items_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-mint-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cart.items_count}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <User size={24} />
                    <span className="text-sm font-medium">{user?.first_name}</span>
                    <ChevronDown size={16} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>

                        <Link
                          to="/cuenta"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Mi perfil
                        </Link>

                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Mis pedidos
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to={"/auth/login"}>
                  <User
                    size={24}
                    className={"text-gray-600 hover:text-gray-900"}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="border-t border-gray-200">
          <div className="flex justify-center space-x-8 py-4">
            <Link to="/" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Inicio</Link>
            <Link to="/productos" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Productos</Link>
            <Link to="/reviews" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Reseñas</Link>
            <Link to="/contacto" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Contacto</Link>
          </div>
        </nav>
      </div>

      {/* Overlay to close user menu when clicking outside */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};
