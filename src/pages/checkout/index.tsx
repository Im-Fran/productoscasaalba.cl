import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import {useCart} from "@/hooks/useCart";
import { useCustomer } from "@/hooks/useCustomer";
import { useShipping } from "@/hooks/useShipping";
import { usePayment } from "@/hooks/usePayment";
import { useNavigate } from "react-router";

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
  const { customer, loading: customerLoading } = useCustomer();
  const { shippingOptions, loading: shippingLoading, selectedShippingId, selectShippingOption } = useShipping();
  const { paymentMethods, loading: paymentLoading, selectedPaymentMethod, selectPaymentMethod, processOrder } = usePayment();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
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

  useEffect(() => {
    // Pre-llenar formulario con datos del usuario autenticado
    if (customer && !customerLoading) {
      // Función para mapear códigos de país a nombres
      const getCountryName = (countryCode: string) => {
        const countryMap: { [key: string]: string } = {
          'CL': 'Chile',
          'AR': 'Argentina',
          'PE': 'Perú',
          'CO': 'Colombia',
          'EC': 'Ecuador',
          'UY': 'Uruguay',
          'PY': 'Paraguay',
          'BO': 'Bolivia',
          'VE': 'Venezuela',
          'BR': 'Brasil'
        };
        return countryMap[countryCode] || countryCode;
      };

      setFormData(prev => ({
        ...prev,
        // Información de contacto desde datos básicos o billing
        firstName: customer.first_name || customer.billing?.first_name || '',
        lastName: customer.last_name || customer.billing?.last_name || '',
        email: customer.email || customer.billing?.email || '',
        phone: customer.billing?.phone || '',

        // Dirección de envío desde shipping o billing como fallback
        address: customer.shipping?.address_1 || customer.billing?.address_1 || '',
        city: customer.shipping?.city || customer.billing?.city || '',
        state: customer.shipping?.state || customer.billing?.state || '',
        zipCode: customer.shipping?.postcode || customer.billing?.postcode || '',

        // Dirección de facturación
        billingAddress: customer.billing?.address_1 || '',
        billingCity: customer.billing?.city || '',
        billingState: customer.billing?.state || '',
        billingZipCode: customer.billing?.postcode || '',
        billingCountry: getCountryName(customer.billing?.country || 'CL'),
      }));
    }
  }, [customer, customerLoading]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de método de pago
    if (!selectedPaymentMethod) {
      toast.error('Por favor, selecciona un método de pago');
      return;
    }

    // Validación de método de envío
    if (!selectedShippingId) {
      toast.error('Por favor, selecciona un método de envío');
      return;
    }

    const loadingToast = toast.loading('Procesando tu pedido...');

    try {
      // Preparar datos del pedido
      const orderData = {
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.useSameAddress ? formData.address : formData.billingAddress,
          city: formData.useSameAddress ? formData.city : formData.billingCity,
          state: formData.useSameAddress ? formData.state : formData.billingState,
          postcode: formData.useSameAddress ? formData.zipCode : formData.billingZipCode,
          country: 'CL',
        },
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zipCode,
          country: 'CL',
          phone: formData.phone,
        },
        payment_method: selectedPaymentMethod,
        customer_note: formData.orderNotes,
      };

      const result = await processOrder(orderData);

      toast.dismiss(loadingToast);

      if (result.success && result.data) {
        toast.success('¡Pedido realizado exitosamente!');

        // Si hay un payment_result con una URL de redirección, redirigir
        if (result.data.payment_result?.redirect_url) {
          window.location.href = result.data.payment_result.redirect_url;
        } else {
          // Redirigir a la página de confirmación o cuenta
          navigate(`/account?order=${result.data.order_id}`);
        }
      } else if (!result.success) {
        toast.error(result.error || 'Error al procesar el pedido');
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const err = error as Error;
      toast.error(err.message || 'Error inesperado al procesar el pedido');
      console.error('Error processing order:', error);
    }
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
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Información de Contacto
                  </h2>
                  {customerLoading && (
                    <div className="flex items-center text-sm text-mint-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mint-600 mr-2"></div>
                      Cargando datos...
                    </div>
                  )}
                  {customer && !customerLoading && (
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Datos pre-llenados
                    </div>
                  )}
                </div>
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
                        Región *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                      >
                        <option value="">Elige una opción…</option>
                        <option value="CL-AI">Aysén del General Carlos Ibañez del Campo</option>
                        <option value="CL-AN">Antofagasta</option>
                        <option value="CL-AP">Arica y Parinacota</option>
                        <option value="CL-AR">La Araucanía</option>
                        <option value="CL-AT">Atacama</option>
                        <option value="CL-BI">Biobío</option>
                        <option value="CL-CO">Coquimbo</option>
                        <option value="CL-LI">Libertador General Bernardo O'Higgins</option>
                        <option value="CL-LL">Los Lagos</option>
                        <option value="CL-LR">Los Ríos</option>
                        <option value="CL-MA">Magallanes</option>
                        <option value="CL-ML">Maule</option>
                        <option value="CL-NB">Ñuble</option>
                        <option value="CL-RM">Región Metropolitana de Santiago</option>
                        <option value="CL-TA">Tarapacá</option>
                        <option value="CL-VS">Valparaíso</option>
                      </select>
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
                  {shippingLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600"></div>
                    </div>
                  ) : (
                    shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedShippingId === option.id
                            ? 'border-mint-500 bg-mint-50'
                            : 'border-gray-200 hover:bg-mint-50 hover:border-mint-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.id}
                          checked={selectedShippingId === option.id}
                          onChange={async (e) => {
                            const rateId = e.target.value;
                            setFormData(prev => ({ ...prev, shippingMethod: rateId }));
                            await selectShippingOption(rateId);
                          }}
                          className="text-mint-600 focus:ring-mint-500"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600">
                            {option.delivery_time || option.description}
                          </div>
                        </div>
                        <div className="font-bold text-mint-700">
                          {option.currency_prefix}{parseInt(option.price).toLocaleString('es-CL')}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Opciones de pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Opciones de Pago
                </h2>
                <div className="space-y-4">
                  {paymentLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600"></div>
                      <span className="ml-3 text-gray-600">Cargando métodos de pago...</span>
                    </div>
                  ) : paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === method.id
                            ? 'border-mint-500 bg-mint-50'
                            : 'border-gray-200 hover:bg-mint-50 hover:border-mint-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => {
                            const methodId = e.target.value;
                            setFormData(prev => ({ ...prev, paymentMethod: methodId }));
                            selectPaymentMethod(methodId);
                          }}
                          className="mt-1 text-mint-600 focus:ring-mint-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-semibold text-gray-900">{method.title}</span>
                          </div>
                          {method.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="text-gray-500 mb-2">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">
                        No hay métodos de pago disponibles
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Por favor, contacte con soporte
                      </p>
                    </div>
                  )}
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

                  {parseInt(cart.totals.total_tax) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Impuestos:</span>
                      <span>{formatPrice(cart.totals.total_tax, cart.totals)}</span>
                    </div>
                  )}

                  {parseInt(cart.totals.total_shipping) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Envío:</span>
                      <span>{formatPrice(cart.totals.total_shipping, cart.totals)}</span>
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
