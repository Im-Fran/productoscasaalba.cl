import { useState, useEffect } from 'react';
import { OrderService, type OrderListItem, type OrderDetail } from '@/services/orders';
import { useAuth } from '@/hooks/useAuth';


const statusColors: Record<string, string> = {
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
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    loadOrders().then();
  }, [user, pagination.page]);

  const loadOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await OrderService.getOrders(pagination.page, pagination.per_page);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading orders:', error);
      const err = error as Error;
      setError(err.message || 'Error al cargar los pedidos. Por favor, inténtalo de nuevo.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetail = async (orderId: number) => {
    try {
      setLoadingDetail(true);
      const detail = await OrderService.getOrder(orderId);
      setSelectedOrder(detail);
    } catch (error) {
      console.error('Error loading order detail:', error);
      const err = error as Error;
      setError(err.message || 'Error al cargar el detalle del pedido');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      return;
    }

    try {
      await OrderService.cancelOrder(orderId);
      alert('Pedido cancelado correctamente');
      // Recargar el detalle del pedido
      await loadOrderDetail(orderId);
      // Recargar la lista de pedidos
      await loadOrders();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      alert(error.message || 'Error al cancelar el pedido');
    }
  };

  const handleReorder = async (orderId: number) => {
    try {
      const result = await OrderService.reorder(orderId);

      let message = result.message;
      if (result.items_failed && result.items_failed.length > 0) {
        message += '\n\nProductos no disponibles:\n';
        result.items_failed.forEach((item) => {
          message += `- ${item.name}: ${item.reason}\n`;
        });
      }

      alert(message);

      // Redirigir al carrito
      window.location.href = '/carrito';
    } catch (error) {
      console.error('Error reordering:', error);
      const err = error as Error;
      alert(err.message || 'Error al volver a pedir');
    }
  };

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

          {loadingDetail ? (
            <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Pedido #{selectedOrder.order_number}
                  </h3>
                  <p className="text-gray-600">
                    Realizado el {new Date(selectedOrder.date_created).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Método de pago: {selectedOrder.payment_method_title}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status] || statusColors.pending}`}>
                  {selectedOrder.status_label}
                </span>
              </div>

              {/* Productos */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">Productos:</h4>
                {selectedOrder.line_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-b-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.sku && (
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      )}
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{item.total_formatted}</p>
                      {item.subtotal !== item.total && (
                        <p className="text-sm text-gray-500 line-through">{item.subtotal_formatted}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de costos */}
              <div className="space-y-2 pb-4 border-b border-gray-300">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{selectedOrder.subtotal_formatted}</span>
                </div>
                {selectedOrder.shipping_lines.map((shipping) => (
                  <div key={shipping.id} className="flex justify-between text-gray-600">
                    <span>{shipping.method_title}:</span>
                    <span>{shipping.total_formatted}</span>
                  </div>
                ))}
                {selectedOrder.discount_total > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span>-{selectedOrder.discount_total_formatted}</span>
                  </div>
                )}
                {selectedOrder.total_tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos:</span>
                    <span>{selectedOrder.total_tax_formatted}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {selectedOrder.total_formatted}
                  </span>
                </div>
              </div>

              {/* Direcciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-300">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dirección de Facturación</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{selectedOrder.billing.first_name} {selectedOrder.billing.last_name}</p>
                    {selectedOrder.billing.company && <p>{selectedOrder.billing.company}</p>}
                    <p>{selectedOrder.billing.address_1}</p>
                    {selectedOrder.billing.address_2 && <p>{selectedOrder.billing.address_2}</p>}
                    <p>{selectedOrder.billing.city}, {selectedOrder.billing.state} {selectedOrder.billing.postcode}</p>
                    <p>{selectedOrder.billing.country}</p>
                    {selectedOrder.billing.phone && <p>Tel: {selectedOrder.billing.phone}</p>}
                    <p>Email: {selectedOrder.billing.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{selectedOrder.shipping.first_name} {selectedOrder.shipping.last_name}</p>
                    {selectedOrder.shipping.company && <p>{selectedOrder.shipping.company}</p>}
                    <p>{selectedOrder.shipping.address_1}</p>
                    {selectedOrder.shipping.address_2 && <p>{selectedOrder.shipping.address_2}</p>}
                    <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.postcode}</p>
                    <p>{selectedOrder.shipping.country}</p>
                  </div>
                </div>
              </div>

              {/* Nota del cliente */}
              {selectedOrder.customer_note && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="font-semibold text-gray-900 mb-2">Notas del pedido:</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_note}</p>
                </div>
              )}

              {/* Acciones del pedido */}
              {Object.keys(selectedOrder.links).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="font-semibold text-gray-900 mb-3">Acciones:</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedOrder.links.pay && (
                      <a
                        href={selectedOrder.links.pay.url}
                        className="bg-mint-600 text-white px-6 py-2 rounded-lg hover:bg-mint-700 transition-colors font-medium"
                      >
                        {selectedOrder.links.pay.label}
                      </a>
                    )}
                    {selectedOrder.links.cancel && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        {selectedOrder.links.cancel.label}
                      </button>
                    )}
                    {selectedOrder.links.reorder && (
                      <button
                        onClick={() => handleReorder(selectedOrder.id)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {selectedOrder.links.reorder.label}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => loadOrderDetail(order.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pedido #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date_created).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.items_count} producto{order.items_count !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.payment_method_title}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status_label}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {order.total_formatted}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Paginación */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Página {pagination.page} de {pagination.total_pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.total_pages}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
