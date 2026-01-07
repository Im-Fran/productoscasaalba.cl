import type { OrderDetail } from '@/services/orders';

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

interface OrderDetailHeaderProps {
  order: OrderDetail;
}

export default function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          Pedido #{order.order_number}
        </h3>
        <p className="text-gray-600">
          Realizado el {new Date(order.date_created).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Método de pago: {order.payment_method_title}
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.pending}`}>
        {order.status_label}
      </span>
    </div>
  );
}

