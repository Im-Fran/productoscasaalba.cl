import CurrencyValue from '@/components/CurrencyValue';
import type { OrderListItem } from '@/services/orders';

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

interface OrderCardProps {
  order: OrderListItem;
  onSelect: (orderId: number) => void;
}

export default function OrderCard({ order, onSelect }: OrderCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(order.id)}
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
            <CurrencyValue value={order.total} />
          </p>
        </div>
      </div>
    </div>
  );
}