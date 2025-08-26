import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import toast from "react-hot-toast";
import {LoadingCart} from "@/pages/cart/loading-cart.tsx";
import {EmptyCart} from "@/pages/cart/empty-cart.tsx";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    formatPrice
  } = useCart();

  const handleApplyCoupon = async (couponCode: string) => {
    if (!couponCode.trim()) return;

    const loadId = toast.loading('Aplicando cupón')
    applyCoupon(couponCode).finally(() => toast.dismiss(loadId))
  };

  const handleRemoveCoupon = async (couponCode: string) => {
    await removeCoupon(couponCode);
  };

  if (loading && !cart) {
    return <LoadingCart/>;
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart/>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header del carrito */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mint-950 mb-4 pacifico-regular">
            Carrito de Compras
          </h1>
          <p className="text-lg text-gray-600 font-handelson">
            Revisa tus productos antes de continuar con la compra
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Productos en tu carrito
                  </h2>
                  <span className="text-sm text-gray-500">
                    {cart.items_count} {cart.items_count === 1 ? 'producto' : 'productos'}
                  </span>
                </div>

                <div className="space-y-6">
                  {cart.items.map((item) => {
                    const itemPrice = formatPrice(item.prices.price, item.prices);
                    const itemTotal = formatPrice(item.totals.line_total, item.totals);
                    const mainImage = item.images[0];

                    return (
                      <div key={item.key} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-mint-200 transition-colors">
                        <div className="flex items-center space-x-4 flex-1">
                          <img
                            src={mainImage?.thumbnail || mainImage?.src || '/placeholder-image.jpg'}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                            <p className="text-mint-700 font-medium">
                              {itemPrice} c/u
                            </p>
                            {item.sku && (
                              <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-6">
                          {/* Quantity controls */}
                          <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 px-3 py-2">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              disabled={loading || item.quantity <= item.quantity_limits.minimum}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-mint-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              disabled={loading || item.quantity >= item.quantity_limits.maximum}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-mint-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Price and remove */}
                          <div className="text-right">
                            <p className="font-bold text-lg text-mint-700 mb-2">
                              {itemTotal}
                            </p>
                            <button
                              onClick={() => removeItem(item.key)}
                              disabled={loading}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del carrito */}
          <div className="space-y-6">
            {/* Cupones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                Código de descuento
              </h3>

              {cart.coupons.length > 0 ? (
                <div className="space-y-3">
                  {cart.coupons.map((coupon) => {
                    const couponDiscount = formatPrice(coupon.totals.total_discount, coupon.totals);
                    return (
                      <div key={coupon.code} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-green-800 font-medium">Cupón: {coupon.code}</span>
                          <button
                            onClick={() => handleRemoveCoupon(coupon.code)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            Quitar
                          </button>
                        </div>
                        <p className="text-sm text-green-600">
                          ✓ {couponDiscount} de descuento aplicado
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <CouponForm onApply={handleApplyCoupon} loading={loading} />
              )}
            </div>

            {/* Totales del carrito */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                Resumen del Pedido
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatPrice(cart.totals.total_items, cart.totals)}
                  </span>
                </div>

                {cart.coupons.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span className="font-medium">
                      -{formatPrice(cart.totals.total_discount, cart.totals)}
                    </span>
                  </div>
                )}

                {parseInt(cart.totals.total_tax) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos:</span>
                    <span className="font-medium">
                      {formatPrice(cart.totals.total_tax, cart.totals)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Envío:</span>
                  <span>
                    {parseInt(cart.totals.total_shipping) > 0
                      ? formatPrice(cart.totals.total_shipping, cart.totals)
                      : 'Se calculará en el checkout'
                    }
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-mint-700">
                      {formatPrice(cart.totals.total_price, cart.totals)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/pagar')}
                  disabled={loading}
                  className="w-full bg-mint-950 hover:bg-mint-900 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? 'Procesando...' : 'Proceder al Checkout'}
                </button>

                <button
                  onClick={() => navigate('/productos')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Continuar comprando
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Los precios incluyen impuestos cuando aplique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente separado para el formulario de cupón
interface CouponFormProps {
  onApply: (code: string) => void;
  loading: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ onApply, loading }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      onApply(couponCode.trim());
      setCouponCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Ingrese código de cupón"
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !couponCode.trim()}
          className="w-full sm:w-auto bg-mint-600 hover:bg-mint-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Aplicando...' : 'Aplicar'}
        </button>
      </div>
    </form>
  );
};
