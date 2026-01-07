import type { OrderDetail as OrderDetailType } from '@/services/orders';
import OrderDetailHeader from './OrderDetailHeader';
import OrderItems from './OrderItems';
import OrderSummary from './OrderSummary';
import OrderAddresses from './OrderAddresses';
import OrderActions from './OrderActions';

interface OrderDetailProps {
  order: OrderDetailType;
  loading: boolean;
  onBack: () => void;
  onCancel: (orderId: number) => void;
  onReorder: (orderId: number) => void;
}

export default function OrderDetail({ order, loading, onBack, onCancel, onReorder }: OrderDetailProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-mint-600 hover:text-mint-700 mb-4"
      >
        ← Volver a pedidos
      </button>

      {loading ? (
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
          <OrderDetailHeader order={order} />
          <OrderItems items={order.line_items} />
          <OrderSummary order={order} />
          <OrderAddresses order={order} />

          {/* Nota del cliente */}
          {order.customer_note && (
            <div className="mt-6 pt-6 border-t border-gray-300">
              <h4 className="font-semibold text-gray-900 mb-2">Notas del pedido:</h4>
              <p className="text-sm text-gray-600">{order.customer_note}</p>
            </div>
          )}

          <OrderActions order={order} onCancel={onCancel} onReorder={onReorder} />
        </div>
      )}
    </div>
  );
}

