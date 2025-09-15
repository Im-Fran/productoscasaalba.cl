import { useState, useEffect } from 'react';
import { OrderService, transformWooOrderToComponentOrder } from '@/services/orders';
import { useAuth } from '@/hooks/useAuth';

// Tipos para los pedidos
interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'checkout-draft';
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

const statusLabels = {
  pending: 'Pendiente',
  processing: 'Procesando',
  'on-hold': 'En espera',
  completed: 'Completado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
  failed: 'Fallido',
  'checkout-draft': 'Borrador'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  'on-hold': 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
  'checkout-draft': 'bg-gray-100 text-gray-800'
};

export default function OrdersSection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Cargar órdenes del cliente desde WooCommerce
        const wooOrders = await OrderService.getCustomerOrders(user.id, {
          per_page: 20, // Cargar hasta 20 órdenes
          order: 'desc',
          orderby: 'date'
        });

        // Transformar órdenes de WooCommerce al formato del componente
        const transformedOrders = wooOrders.map(transformWooOrderToComponentOrder);
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Error al cargar los pedidos. Por favor, inténtalo de nuevo.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar pedidos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-mint-600 text-white px-6 py-2 rounded hover:bg-mint-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Pedidos</h2>
            <p className="text-gray-600 mb-6">
              Aún no has realizado ningún pedido. ¡Descubre nuestros productos y haz tu primera compra!
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/productos"
              className="block w-full bg-mint-600 text-white px-6 py-3 rounded-lg hover:bg-mint-700 transition-colors font-medium"
            >
              Explorar Productos
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>

      {selectedOrder ? (
        <div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-mint-600 hover:text-mint-700 mb-4"
          >
            ← Volver a pedidos
          </button>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Pedido #{selectedOrder.orderNumber}
                </h3>
                <p className="text-gray-600">
                  Realizado el {new Date(selectedOrder.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                {statusLabels[selectedOrder.status]}
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Productos:</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${selectedOrder.total.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pedido #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    ${order.total.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
