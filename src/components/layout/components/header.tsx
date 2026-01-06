import {Link} from "react-router";
import CasaAlbaLogo from "@/assets/casaalba.webp";
import {ShoppingBag, User, LogOut, ChevronDown, Menu, X} from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="container mx-auto px-4">
        {/* Top section with logo and icons */}
        <div className="flex items-center justify-between gap-2 py-3 md:py-4">
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            to={"/"}
            className="flex-1 h-16 md:h-24 max-w-[200px] md:max-w-none"
            style={{
              backgroundImage: `url(${CasaAlbaLogo})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: '60px auto',
              backgroundPosition: 'left center',
            }}
          />

          <div className={"flex items-center gap-3 md:gap-4"}>
            <button onClick={onCartClick} className="relative p-1">
              <ShoppingBag
                size={24}
                className={"text-gray-600 hover:text-gray-900"}
              />
              {cart && cart.items_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-mint-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
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
                    className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-gray-900 p-1"
                  >
                    <User size={24} />
                    <span className="hidden md:inline text-sm font-medium">{user?.first_name}</span>
                    <ChevronDown size={16} className="hidden md:inline" />
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
                <Link to={"/auth/login"} className="p-1">
                  <User
                    size={24}
                    className={"text-gray-600 hover:text-gray-900"}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation menu */}
        <nav className="hidden md:block border-t border-gray-200">
          <div className="flex justify-center space-x-8 py-4">
            <Link to="/" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Inicio</Link>
            <Link to="/productos" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Productos</Link>
            <Link to="/reviews" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Reseñas</Link>
            <Link to="/contacto" className="text-gray-700 hover:text-mint-600 font-medium transition-colors">Contacto</Link>
          </div>
        </nav>

        {/* Mobile Navigation menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-3">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-mint-600 font-medium transition-colors py-2 px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/productos" 
                className="text-gray-700 hover:text-mint-600 font-medium transition-colors py-2 px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                to="/reviews" 
                className="text-gray-700 hover:text-mint-600 font-medium transition-colors py-2 px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reseñas
              </Link>
              <Link 
                to="/contacto" 
                className="text-gray-700 hover:text-mint-600 font-medium transition-colors py-2 px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </nav>
        )}
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
