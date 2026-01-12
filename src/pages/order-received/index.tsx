import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { OrderService } from '@/services/orders';
import type { OrderDetail } from '@/services/orders';
import { CheckCircle, Package, Truck, CreditCard, Mail, Phone, LogIn, UserPlus } from 'lucide-react';
import CurrencyValue from "@/components/CurrencyValue.tsx";
import { useAuth } from '@/hooks/useAuth';

export default function OrderReceivedPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const orderKey = searchParams.get('key');
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('No se proporcionó un número de pedido');
      setLoading(false);
      return;
    }

    // Esperar a que termine la verificación de autenticación
    if (authLoading) {
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);

        // Si hay orderKey, usar el endpoint público (no requiere autenticación)
        // Si no hay orderKey pero el usuario está autenticado, usar el endpoint autenticado
        const orderData = orderKey
          ? await OrderService.getOrder(parseInt(orderId), orderKey)
          : await OrderService.getOrder(parseInt(orderId));

        setOrder(orderData);
        setError(null);
        setRequiresAuth(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        const errorMessage = (err as Error).message || '';

        // Si el error es de autenticación y no tenemos orderKey, mostrar mensaje especial
        if (!orderKey && (errorMessage.includes('401') || errorMessage.includes('autenticación') || errorMessage.includes('autorizado'))) {
          setRequiresAuth(true);
          setError(null);
        } else {
          setError('No se pudo cargar la información del pedido');
          setRequiresAuth(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder().then();
  }, [orderId, orderKey, authLoading]);

  // Get status color and text
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; bgColor: string }> = {
      'pending': { color: 'text-yellow-700', text: 'Pendiente de Pago', bgColor: 'bg-yellow-50' },
      'processing': { color: 'text-blue-700', text: 'Procesando', bgColor: 'bg-blue-50' },
      'on-hold': { color: 'text-orange-700', text: 'En Espera', bgColor: 'bg-orange-50' },
      'completed': { color: 'text-green-700', text: 'Completado', bgColor: 'bg-green-50' },
      'cancelled': { color: 'text-red-700', text: 'Cancelado', bgColor: 'bg-red-50' },
      'refunded': { color: 'text-purple-700', text: 'Reembolsado', bgColor: 'bg-purple-50' },
      'failed': { color: 'text-red-700', text: 'Fallido', bgColor: 'bg-red-50' },
    };
    return statusMap[status] || { color: 'text-gray-700', text: status, bgColor: 'bg-gray-50' };
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mint-950 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  // Si requiere autenticación y el usuario no está logueado
  if (requiresAuth && !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-mint-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Pedido Registrado</h1>
          <p className="text-gray-600 mb-6 text-center">
            Tu pedido <strong>#{orderId}</strong> ha sido registrado exitosamente.
          </p>

          <div className="bg-mint-50 border border-mint-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-mint-800 mb-2">
              <strong>Para ver el detalle completo de tu pedido:</strong>
            </p>
            <p className="text-sm text-mint-700">
              Inicia sesión o crea una cuenta con el correo electrónico que usaste en el pedido.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/auth/login"
              className="w-full flex items-center justify-center gap-2 bg-mint-950 hover:bg-mint-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </Link>
            <Link
              to="/auth/register"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-mint-950 border-2 border-mint-950 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Crear Cuenta
            </Link>
            <Link
              to="/"
              className="w-full flex items-center justify-center text-mint-700 hover:text-mint-800 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'No se pudo cargar el pedido'}</p>
          <Link
            to="/"
            className="inline-block bg-mint-950 hover:bg-mint-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 pacifico-regular">
            ¡Pedido Recibido!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Gracias por tu compra. Tu pedido ha sido registrado exitosamente.
          </p>
          <div className={`inline-block px-4 py-2 rounded-lg ${statusInfo.bgColor}`}>
            <span className={`font-semibold ${statusInfo.color}`}>
              Estado: {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Detalles del Pedido
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Número de Pedido</p>
              <p className="font-semibold text-gray-900">#{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.date_created).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Método de Pago</p>
              <p className="font-semibold text-gray-900">{order.payment_method_title || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold text-gray-900 text-xl">{order.total}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos</h2>
          <div className="divide-y divide-gray-200">
            {order.line_items.map((item) => (
              <div key={item.id} className="py-4 flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900"><CurrencyValue value={item.total * 1.19}/></p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Totals */}
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal (IVA Incl.):</span>
              <span><CurrencyValue>{parseFloat(`${order.subtotal}`) + parseFloat(`${order.total_tax}`)}</CurrencyValue></span>
            </div>
            {order.shipping_total > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Envío:</span>
                <CurrencyValue>{order.shipping_total}</CurrencyValue>
              </div>
            )}
            {order.discount_total > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento:</span>
                <span>-<CurrencyValue>{order.discount_total}</CurrencyValue></span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total:</span>
              <span className="text-mint-700"><CurrencyValue>{order.total}</CurrencyValue></span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Dirección de Envío
            </h2>
            <div className="space-y-2 text-gray-600">
              <p className="font-medium text-gray-900">
                {order.shipping.first_name} {order.shipping.last_name}
              </p>
              {order.shipping.company && <p>{order.shipping.company}</p>}
              <p>{order.shipping.address_1}</p>
              {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
              <p>
                {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
              </p>
              <p>{order.shipping.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Dirección de Facturación
            </h2>
            <div className="space-y-2 text-gray-600">
              <p className="font-medium text-gray-900">
                {order.billing.first_name} {order.billing.last_name}
              </p>
              {order.billing.company && <p>{order.billing.company}</p>}
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>
                {order.billing.city}, {order.billing.state} {order.billing.postcode}
              </p>
              <p>{order.billing.country}</p>
              
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {order.billing.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {order.billing.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Note */}
        {order.customer_note && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nota del Pedido</h2>
            <p className="text-gray-600">{order.customer_note}</p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-mint-50 border border-mint-200 rounded-lg p-6 text-center">
          <p className="text-mint-800 mb-4">
            Recibirás un correo electrónico con los detalles de tu pedido a <strong>{order.billing.email}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pedidos"
              className="inline-block bg-mint-950 hover:bg-mint-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Mis Pedidos
            </Link>
            <Link
              to="/"
              className="inline-block bg-white hover:bg-gray-50 text-mint-950 border-2 border-mint-950 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
