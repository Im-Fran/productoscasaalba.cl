import axiosInstance from '@/utils/axios';

// Nuevos tipos para Casa Alba API
export interface OrderListItem {
  id: number;
  order_number: string;
  date_created: string;
  date_created_gmt: string;
  status: string;
  status_label: string;
  total: number;
  total_formatted: string;
  currency: string;
  payment_method: string;
  payment_method_title: string;
  items_count: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  variation_id: number;
  name: string;
  quantity: number;
  subtotal: number;
  subtotal_formatted: string;
  total: number;
  total_formatted: string;
  sku: string;
  image: string;
}

export interface OrderShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  total: number;
  total_formatted: string;
}

export interface OrderAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface OrderActionLink {
  url: string;
  label: string;
}

export interface OrderDetail extends OrderListItem {
  order_key: string;
  date_modified: string | null;
  subtotal: number;
  subtotal_formatted: string;
  total_tax: number;
  total_tax_formatted: string;
  shipping_total: number;
  shipping_total_formatted: string;
  discount_total: number;
  discount_total_formatted: string;
  customer_note: string;
  billing: OrderAddress;
  shipping: OrderAddress;
  line_items: OrderItem[];
  shipping_lines: OrderShippingLine[];
  links: {
    pay?: OrderActionLink;
    cancel?: OrderActionLink;
    reorder?: OrderActionLink;
  };
}

export interface OrdersListResponse {
  orders: OrderListItem[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Legacy types for WooCommerce API
export interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  price: number;
  sku: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

// Legacy types for WooCommerce API
export interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  price: number;
  sku: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

export interface WooOrderShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  total: string;
  total_tax: string;
}

export interface OrderBillingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface OrderShippingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderTaxLine {
  id: number;
  rate_code: string;
  rate_id: number;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
}

export interface OrderFeeLine {
  id: number;
  name: string;
  tax_class: string;
  tax_status: string;
  total: string;
  total_tax: string;
}

export interface OrderCouponLine {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
}

export interface OrderRefund {
  id: number;
  reason: string;
  total: string;
}

export interface WooCommerceOrder {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'checkout-draft';
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: OrderBillingAddress;
  shipping: OrderShippingAddress;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string | null;
  date_paid_gmt: string | null;
  date_completed: string | null;
  date_completed_gmt: string | null;
  cart_hash: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
  line_items: OrderLineItem[];
  tax_lines: OrderTaxLine[];
  shipping_lines: WooOrderShippingLine[];
  fee_lines: OrderFeeLine[];
  coupon_lines: OrderCouponLine[];
  refunds: OrderRefund[];
}

export interface GetOrdersParams {
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
  status?: 'any' | 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'checkout-draft';
  customer?: number;
  product?: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export class OrderService {
  private static readonly BASE_URL = '/api/wp-json/casa-alba/v1/customer/orders';

  /**
   * Obtener todos los pedidos del cliente autenticado
   */
  static async getOrders(page = 1, perPage = 10, status = 'any'): Promise<OrdersListResponse> {
    try {
      console.log('🔍 Fetching orders with Casa Alba API:', { page, perPage, status });

      const response = await axiosInstance.get<OrdersListResponse>(this.BASE_URL, {
        params: { page, per_page: perPage, status },
      });

      console.log('✅ Orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting orders:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener los pedidos');
    }
  }

  /**
   * Obtener detalle de un pedido específico
   * Si se proporciona orderKey, usa el endpoint público (no requiere autenticación)
   */
  static async getOrder(orderId: number, orderKey?: string): Promise<OrderDetail> {
    try {
      console.log(`🔍 Fetching order detail for ID: ${orderId}`, orderKey ? 'with order key' : 'authenticated');

      let response;

      if (orderKey) {
        // Usar endpoint público con order_key
        response = await axiosInstance.get<OrderDetail>(`/api/wp-json/casa-alba/v1/orders/${orderId}/public`, {
          params: { key: orderKey }
        });
      } else {
        // Usar endpoint autenticado
        response = await axiosInstance.get<OrderDetail>(`${this.BASE_URL}/${orderId}`);
      }

      console.log('✅ Order detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting order detail:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener el detalle del pedido');
    }
  }

  /**
   * Cancelar un pedido
   */
  static async cancelOrder(orderId: number): Promise<{ message: string; order_id: number; status: string }> {
    try {
      console.log(`🔍 Cancelling order ID: ${orderId}`);

      const response = await axiosInstance.post(`${this.BASE_URL}/${orderId}/cancel`);

      console.log('✅ Cancel order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al cancelar el pedido');
    }
  }

  /**
   * Volver a pedir - agregar productos de un pedido anterior al carrito
   */
  static async reorder(orderId: number): Promise<{
    message: string;
    items_added: number;
    cart_item_count: number;
    items_failed?: Array<{ name: string; reason: string }>;
    warning?: string;
  }> {
    try {
      console.log(`🔍 Reordering order ID: ${orderId}`);

      const response = await axiosInstance.post(`${this.BASE_URL}/${orderId}/reorder`);

      console.log('✅ Reorder response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error reordering:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al volver a pedir');
    }
  }

  /**
   * Obtener pedidos del cliente autenticado (legacy wrapper)
   */
  static async getCustomerOrders(customerId: number, params?: Omit<GetOrdersParams, 'customer'>): Promise<WooCommerceOrder[]> {
    try {
      console.log(`🔍 Fetching orders for customer ID: ${customerId} (using Casa Alba API)`);

      const page = params?.page || 1;
      const perPage = params?.per_page || 10;
      const status = params?.status || 'any';

      const response = await this.getOrders(page, perPage, status);

      // Convertir OrderListItem[] a WooCommerceOrder[] para compatibilidad
      const wooOrders: WooCommerceOrder[] = response.orders.map((order) => ({
        id: order.id,
        parent_id: 0,
        number: order.order_number,
        order_key: '',
        created_via: 'checkout',
        version: '',
        status: order.status as 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'checkout-draft',
        currency: order.currency,
        date_created: order.date_created,
        date_created_gmt: order.date_created_gmt,
        date_modified: order.date_created,
        date_modified_gmt: order.date_created_gmt,
        discount_total: '0',
        discount_tax: '0',
        shipping_total: '0',
        shipping_tax: '0',
        cart_tax: '0',
        total: order.total.toString(),
        total_tax: '0',
        prices_include_tax: false,
        customer_id: customerId,
        customer_ip_address: '',
        customer_user_agent: '',
        customer_note: '',
        billing: {} as OrderBillingAddress,
        shipping: {} as OrderShippingAddress,
        payment_method: order.payment_method,
        payment_method_title: order.payment_method_title,
        transaction_id: '',
        date_paid: null,
        date_paid_gmt: null,
        date_completed: null,
        date_completed_gmt: null,
        cart_hash: '',
        meta_data: [],
        line_items: [],
        tax_lines: [],
        shipping_lines: [],
        fee_lines: [],
        coupon_lines: [],
        refunds: [],
      }));

      console.log('✅ Converted to WooCommerce format:', wooOrders.length, 'orders');
      return wooOrders;
    } catch (error) {
      console.error('❌ Error getting customer orders:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener los pedidos del cliente');
    }
  }

  /**
   * Obtener pedidos recientes del cliente (legacy wrapper)
   */
  static async getRecentCustomerOrders(customerId: number, limit: number = 5): Promise<WooCommerceOrder[]> {
    return await this.getCustomerOrders(customerId, {
      per_page: limit,
      order: 'desc',
      orderby: 'date'
    });
  }
}

// Función helper para convertir OrderListItem a Order (formato del componente)
export const transformOrderListItemToComponentOrder = (orderItem: OrderListItem) => {
  return {
    id: orderItem.id,
    orderNumber: orderItem.order_number,
    date: orderItem.date_created,
    status: orderItem.status as 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'checkout-draft',
    total: orderItem.total,
    items: [] as Array<{ id: number; name: string; quantity: number; price: number; image?: string }>,
  };
};

// Función helper para convertir WooCommerceOrder a Order (formato del componente) - legacy
export const transformWooOrderToComponentOrder = (wooOrder: WooCommerceOrder) => {
  return {
    id: wooOrder.id,
    orderNumber: wooOrder.number,
    date: wooOrder.date_created,
    status: wooOrder.status,
    total: parseFloat(wooOrder.total),
    items: wooOrder.line_items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: parseFloat(item.total) / item.quantity,
      image: undefined // WooCommerce no incluye imágenes en line_items por defecto
    }))
  };
};
