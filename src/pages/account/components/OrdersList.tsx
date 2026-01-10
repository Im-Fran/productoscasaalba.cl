import type { OrderListItem } from '@/services/orders';
import OrderCard from './OrderCard';

interface OrdersListProps {
  orders: OrderListItem[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  onSelectOrder: (orderId: number) => void;
  onPageChange: (page: number) => void;
}

export default function OrdersList({ orders, pagination, onSelectOrder, onPageChange }: OrdersListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onSelect={onSelectOrder} />
      ))}

      {/* Paginación */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {pagination.page} de {pagination.total_pages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.total_pages}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

