import CurrencyValue from '@/components/CurrencyValue';
import type { OrderDetail } from '@/services/orders';

interface OrderItemsProps {
  items: OrderDetail['line_items'];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-semibold text-gray-900">Productos:</h4>
      {items.map((item) => (
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
            <p className="font-medium text-gray-900"><CurrencyValue value={item.total} /></p>
            {item.subtotal !== item.total && (
              <p className="text-sm text-gray-500 line-through"><CurrencyValue value={item.subtotal} /></p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

