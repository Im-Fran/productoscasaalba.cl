import { useState, useEffect } from 'react';
import { OrderService, type OrderListItem, type OrderDetail as OrderDetailType } from '@/services/orders';
import { useAuth } from '@/hooks/useAuth';
import OrdersList from './OrdersList';
import OrderDetail from './OrderDetail';
import OrdersLoading from './OrdersLoading';
import OrdersError from './OrdersError';
import EmptyOrders from './EmptyOrders';

export default function OrdersSection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailType | null>(null);
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
    } catch (error) {
      console.error('Error cancelling order:', error);
      const err = error as Error;
      alert(err.message || 'Error al cancelar el pedido');
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
    return <OrdersLoading />;
  }

  if (error) {
    return <OrdersError error={error} />;
  }

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>

      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          loading={loadingDetail}
          onBack={() => setSelectedOrder(null)}
          onCancel={handleCancelOrder}
          onReorder={handleReorder}
        />
      ) : (
        <OrdersList
          orders={orders}
          pagination={pagination}
          onSelectOrder={loadOrderDetail}
          onPageChange={(page) => setPagination({ ...pagination, page })}
        />
      )}
    </div>
  );
}
