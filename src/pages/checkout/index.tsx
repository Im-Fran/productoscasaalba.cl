import { useState } from 'react';
import toast from "react-hot-toast";
import {useCart} from "@/contexts/UseCart.tsx";

interface CheckoutForm {
  // Información de contacto
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Dirección de envío
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Dirección de facturación
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;

  // Opciones
  useSameAddress: boolean;
  shippingMethod: string;
  paymentMethod: string;
  orderNotes: string;
}

export default function CheckoutPage() {
  const { cart, loading: cartLoading, applyCoupon, removeCoupon, formatPrice } = useCart();

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Chile',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'Chile',
    useSameAddress: true,
    shippingMethod: 'standard',
    paymentMethod: '',
    orderNotes: ''
  });

  const [couponCode, setCouponCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    const loadId = toast.loading('Aplicando cupón...');
    const success = await applyCoupon(couponCode).finally(() => toast.dismiss(loadId))
    if (success) {
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = async (couponCodeToRemove: string) => {
    await removeCoupon(couponCodeToRemove);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del pedido:', formData);
    console.log('Carrito:', cart);
    alert('Pedido procesado exitosamente!');
  };

  // Mostrar estado de carga si el carrito aún no está disponible
  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-950 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirigir si el carrito está vacío
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mint-950 mb-4 pacifico-regular">
              No hay productos en tu carrito
            </h1>
            <p className="text-lg text-gray-600 mb-8 font-handelson">
              Agrega algunos productos antes de proceder al checkout
            </p>
            <a
              href="/productos"
              className="bg-mint-950 hover:bg-mint-900 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ver Productos
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header del checkout */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mint-950 mb-4 pacifico-regular">
            Finalizar Compra
          </h1>
          <p className="text-lg text-gray-600 font-handelson">
            Complete su información para procesar su pedido
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de checkout - 2 columnas en pantallas grandes */}
            <div className="lg:col-span-2 space-y-8">
              {/* Información de contacto */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Información de Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      placeholder="Ingrese su nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      placeholder="Ingrese su apellido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      placeholder="+593 123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Dirección de Envío
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      placeholder="Calle principal, número, sector"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                        placeholder="Santiago"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                        placeholder="Macul"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                        placeholder="7810000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      >
                        <option value="Ecuador">Ecuador</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Perú">Perú</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-mint-50 border border-mint-200 rounded-lg p-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="useSameAddress"
                        checked={formData.useSameAddress}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-mint-600 focus:ring-mint-500"
                      />
                      <span className="text-sm text-mint-800 font-medium">
                        Usar la misma dirección para facturación
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Opciones de envío */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Opciones de Envío
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-mint-50 hover:border-mint-300 transition-all duration-200 has-[:checked]:border-mint-500 has-[:checked]:bg-mint-50">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleInputChange}
                      className="text-mint-600 focus:ring-mint-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Envío Estándar</div>
                      <div className="text-sm text-gray-600">5-7 días hábiles</div>
                    </div>
                    <div className="font-bold text-mint-700">$5.00</div>
                  </label>

                  <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-mint-50 hover:border-mint-300 transition-all duration-200 has-[:checked]:border-mint-500 has-[:checked]:bg-mint-50">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleInputChange}
                      className="text-mint-600 focus:ring-mint-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Envío Express</div>
                      <div className="text-sm text-gray-600">2-3 días hábiles</div>
                    </div>
                    <div className="font-bold text-mint-700">$15.00</div>
                  </label>
                </div>
              </div>

              {/* Opciones de pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Opciones de Pago
                </h2>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-500 mb-2">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Próximamente - Métodos de pago en desarrollo
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Estamos trabajando para ofrecerte las mejores opciones de pago
                  </p>
                </div>
              </div>

              {/* Notas del pedido */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Notas del Pedido
                </h2>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Instrucciones especiales para la entrega (opcional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Resumen del pedido - 1 columna en pantallas grandes */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Resumen del Pedido
                </h2>

                {/* Lista de productos */}
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => {
                    const itemPrice = formatPrice(item.prices.price, item.prices);
                    const itemTotal = formatPrice(item.totals.line_total, item.totals);
                    const mainImage = item.images[0];

                    return (
                      <div key={item.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="relative">
                          <img
                            src={mainImage?.thumbnail || mainImage?.src || '/placeholder-image.jpg'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <span className="absolute -top-2 -right-2 bg-mint-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-900">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {itemPrice} × {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold text-mint-700">
                          {itemTotal}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cupón */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Código de descuento</h3>

                  {cart.coupons.length > 0 ? (
                    <div className="space-y-3">
                      {cart.coupons.map((coupon) => {
                        const couponDiscount = formatPrice(coupon.totals.total_discount, coupon.totals);
                        return (
                          <div key={coupon.code} className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-green-800 font-medium">Cupón: {coupon.code}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveCoupon(coupon.code)}
                                disabled={cartLoading}
                                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                Quitar
                              </button>
                            </div>
                            <p className="text-green-700 text-sm font-medium">
                              ✓ {couponDiscount} de descuento aplicado
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Ingrese código de cupón"
                        disabled={cartLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={cartLoading || !couponCode.trim()}
                        className="w-full sm:w-auto bg-mint-600 hover:bg-mint-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cartLoading ? 'Aplicando...' : 'Aplicar'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Totales */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cart.totals.total_items, cart.totals)}</span>
                  </div>

                  {cart.coupons.length > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatPrice(cart.totals.total_discount, cart.totals)}</span>
                    </div>
                  )}

                  {parseInt(cart.totals.total_shipping) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Envío:</span>
                      <span>{formatPrice(cart.totals.total_shipping, cart.totals)}</span>
                    </div>
                  )}

                  {parseInt(cart.totals.total_tax) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Impuestos:</span>
                      <span>{formatPrice(cart.totals.total_tax, cart.totals)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-mint-700">
                        {formatPrice(cart.totals.total_price, cart.totals)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cartLoading}
                  className="w-full bg-mint-950 hover:bg-mint-900 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 mt-6 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {cartLoading ? 'Procesando...' : 'Realizar Pedido'}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Al realizar el pedido, acepta nuestros términos y condiciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
