import type { OrderDetail } from '@/services/orders';

interface OrderActionsProps {
  order: OrderDetail;
  onCancel: (orderId: number) => void;
  onReorder: (orderId: number) => void;
}

export default function OrderActions({ order, onCancel, onReorder }: OrderActionsProps) {
  // Si el pedido está en borrador (carrito), mostrar botón para ir al checkout
  if (order.status === 'checkout-draft') {
    return (
      <div className="mt-6 pt-6 border-t border-gray-300">
        <h4 className="font-semibold text-gray-900 mb-3">Acciones:</h4>
        <div className="flex flex-wrap gap-3">
          <a
            href="/pagar"
            className="bg-mint-600 text-white px-6 py-2 rounded-lg hover:bg-mint-700 transition-colors font-medium"
          >
            Ir al Checkout
          </a>
        </div>
      </div>
    );
  }

  if (Object.keys(order.links).length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-300">
      <h4 className="font-semibold text-gray-900 mb-3">Acciones:</h4>
      <div className="flex flex-wrap gap-3">
        {order.links.pay && (
          <a
            href={order.links.pay.url}
            className="bg-mint-600 text-white px-6 py-2 rounded-lg hover:bg-mint-700 transition-colors font-medium"
          >
            {order.links.pay.label}
          </a>
        )}
        {order.links.cancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {order.links.cancel.label}
          </button>
        )}
        {order.links.reorder && (
          <button
            onClick={() => onReorder(order.id)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {order.links.reorder.label}
          </button>
        )}
      </div>
    </div>
  );
}

