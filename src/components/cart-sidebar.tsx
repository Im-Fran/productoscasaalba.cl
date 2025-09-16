import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import {useCart} from "@/hooks/useCart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cart, loading, updateQuantity, removeItem, formatPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure the element is rendered before starting animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const handleUpdateQuantity = async (itemKey: string, newQuantity: number) => {
    try {
      await updateQuantity(itemKey, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemKey: string) => {
    try {
      await removeItem(itemKey);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sidebar with slide animation */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tu Carrito</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Cargando carrito...</p>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Link
                to="/productos"
                onClick={handleClose}
                className="inline-block bg-mint-600 text-white px-4 py-2 rounded-md hover:bg-mint-700 transition-colors"
              >
                Ver Productos
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="p-4 space-y-4">
                {cart.items.map((item, index) => (
                  <div
                    key={item.key}
                    className={`flex items-center space-x-3 bg-gray-50 p-3 rounded-lg transform transition-all duration-300 ${
                      isAnimating 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isAnimating ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.images?.[0]?.src || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.prices.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.key, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          disabled={loading}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 py-1 bg-white rounded border text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.key, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          disabled={loading}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total and Remove */}
                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.totals.line_total)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.key)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cart.totals.total_items)}</span>
                  </div>
                  {cart.totals.total_tax !== '0' && (
                    <div className="flex justify-between text-sm">
                      <span>Impuestos:</span>
                      <span>{formatPrice(cart.totals.total_tax)}</span>
                    </div>
                  )}
                  {cart.totals.total_shipping !== '0' && (
                    <div className="flex justify-between text-sm">
                      <span>Envío:</span>
                      <span>{formatPrice(cart.totals.total_shipping)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(cart.totals.total_price)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  <Link
                    to="/carrito"
                    onClick={handleClose}
                    className="block w-full text-center bg-gray-100 text-gray-900 py-2 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Ver Carrito Completo
                  </Link>
                  <Link
                    to="/pagar"
                    onClick={handleClose}
                    className="block w-full text-center bg-mint-600 text-white py-2 rounded-md hover:bg-mint-700 transition-colors"
                  >
                    Proceder al Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
