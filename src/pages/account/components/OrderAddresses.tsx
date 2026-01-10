import type { OrderDetail } from '@/services/orders';

interface OrderAddressesProps {
  order: OrderDetail;
}

export default function OrderAddresses({ order }: OrderAddressesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-300">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Dirección de Facturación</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{order.billing.first_name} {order.billing.last_name}</p>
          {order.billing.company && <p>{order.billing.company}</p>}
          <p>{order.billing.address_1}</p>
          {order.billing.address_2 && <p>{order.billing.address_2}</p>}
          <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
          <p>{order.billing.country}</p>
          {order.billing.phone && <p>Tel: {order.billing.phone}</p>}
          <p>Email: {order.billing.email}</p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{order.shipping.first_name} {order.shipping.last_name}</p>
          {order.shipping.company && <p>{order.shipping.company}</p>}
          <p>{order.shipping.address_1}</p>
          {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
          <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
          <p>{order.shipping.country}</p>
        </div>
      </div>
    </div>
  );
}

