import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { OrderService } from '@/services/orders';
import type { WooCommerceOrder } from '@/services/orders';
import { XCircle, ShoppingCart, HelpCircle, MessageCircle } from 'lucide-react';

export default function OrderCancelledPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [order, setOrder] = useState<WooCommerceOrder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await OrderService.getOrder(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        // No mostramos error porque el pedido puede no existir si se canceló antes de crearse
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mint-950 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cancellation Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 pacifico-regular">
            Pedido Cancelado
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {order 
              ? `Tu pedido #${order.number} ha sido cancelado.`
              : 'Tu pedido ha sido cancelado.'
            }
          </p>
          {order && (
            <div className="inline-block px-4 py-2 rounded-lg bg-orange-50">
              <span className="font-semibold text-orange-700">
                Número de Pedido: #{order.number}
              </span>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <HelpCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                ¿Qué sucedió?
              </h2>
              <p className="text-blue-800 mb-2">
                El proceso de pago fue cancelado. Esto puede deberse a:
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Decidiste no completar la compra</li>
                <li>Cerraste la ventana del pago</li>
                <li>Hubo un problema con tu método de pago</li>
                <li>El tiempo de la sesión expiró</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Qué puedes hacer ahora?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-mint-700 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Intenta nuevamente
                </h3>
                <p className="text-gray-600">
                  Los productos siguen en tu carrito. Puedes volver a intentar completar tu compra cuando estés listo.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-mint-700 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Revisa tu método de pago
                </h3>
                <p className="text-gray-600">
                  Asegúrate de que tu tarjeta o método de pago esté activo y tenga fondos suficientes.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-mint-700 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Explora otros productos
                </h3>
                <p className="text-gray-600">
                  Navega nuestro catálogo para encontrar más productos que te puedan interesar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* No charges message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-green-800">
            <strong>Importante:</strong> No se ha realizado ningún cargo a tu método de pago. 
            Tu dinero está seguro.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/carrito"
            className="w-full flex items-center justify-center bg-mint-950 hover:bg-mint-900 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Volver al Carrito
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/productos"
              className="flex items-center justify-center bg-white hover:bg-gray-50 text-mint-950 border-2 border-mint-950 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continuar Comprando
            </Link>
            <Link
              to="/contacto"
              className="flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contáctanos
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">¿Necesitas ayuda?</p>
          <p className="text-sm">
            Si tienes alguna duda o problema, no dudes en{' '}
            <Link to="/contacto" className="text-mint-700 hover:text-mint-800 font-semibold underline">
              contactarnos
            </Link>
            . Estamos aquí para ayudarte.
          </p>
        </div>
      </div>
    </div>
  );
}
