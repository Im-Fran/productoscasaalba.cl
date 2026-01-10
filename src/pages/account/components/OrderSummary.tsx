import CurrencyValue from '@/components/CurrencyValue';
import type { OrderDetail } from '@/services/orders';

interface OrderSummaryProps {
  order: OrderDetail;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <>
      {/* Resumen de costos */}
      <div className="space-y-2 pb-4 border-b border-gray-300">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span><CurrencyValue value={order.subtotal} /></span>
        </div>
        {order.shipping_lines.map((shipping) => (
          <div key={shipping.id} className="flex justify-between text-gray-600">
            <span>{shipping.method_title}:</span>
            <span><CurrencyValue value={shipping.total} /></span>
          </div>
        ))}
        {order.discount_total > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento:</span>
            <span>-<CurrencyValue value={order.discount_total} /></span>
          </div>
        )}
        {order.total_tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Impuestos:</span>
            <span><CurrencyValue value={order.total_tax} /></span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-lg font-bold text-gray-900">
            <CurrencyValue value={order.total} />
          </span>
        </div>
      </div>
    </>
  );
}

