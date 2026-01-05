import axiosInstance from '@/utils/axios';

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

export interface OrderShippingLine {
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
  shipping_lines: OrderShippingLine[];
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
  private static readonly BASE_URL = '/api/wp-json/wc/v1/orders';

  /**
   * Obtener órdenes con filtros opcionales
   */
  static async getOrders(params?: GetOrdersParams): Promise<WooCommerceOrder[]> {
    try {
      console.log('🔍 Fetching orders with params:', params);
      console.log('📍 Request URL:', this.BASE_URL);

      const response = await axiosInstance.get(this.BASE_URL, { params });

      console.log('✅ Orders response status:', response.status);
      console.log('📊 Orders response data:', response.data);
      console.log('📈 Number of orders returned:', Array.isArray(response.data) ? response.data.length : 'Not an array');

      return response.data;
    } catch (error) {
      console.error('❌ Error getting orders:', error);
      const apiError = error as ApiError;

      // Log más detalles del error
      if (apiError.response) {
        console.error('🔴 Response data:', apiError.response.data);
      }

      throw new Error(apiError.response?.data?.message || 'Error al obtener las órdenes');
    }
  }

  /**
   * Obtener órdenes de un cliente específico
   */
  static async getCustomerOrders(customerId: number, params?: Omit<GetOrdersParams, 'customer'>): Promise<WooCommerceOrder[]> {
    try {
      console.log(`🔍 Fetching orders for customer ID: ${customerId}`);

      const orderParams: GetOrdersParams = {
        customer: customerId,
        order: 'desc',
        orderby: 'date',
        status: 'any', // Agregar explícitamente status 'any' para obtener todas las órdenes
        ...params
      };

      console.log('📋 Final order parameters:', orderParams);

      return await this.getOrders(orderParams);
    } catch (error) {
      console.error('❌ Error getting customer orders:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener los pedidos del cliente');
    }
  }

  /**
   * Obtener una orden específica por ID
   */
  static async getOrder(orderId: number): Promise<WooCommerceOrder> {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener el pedido');
    }
  }

  /**
   * Obtener órdenes recientes del cliente
   */
  static async getRecentCustomerOrders(customerId: number, limit: number = 5): Promise<WooCommerceOrder[]> {
    return await this.getCustomerOrders(customerId, {
      per_page: limit,
      order: 'desc',
      orderby: 'date'
    });
  }

  /**
   * Método de prueba para verificar la conectividad con la API
   */
  static async testOrdersAPI(): Promise<any> {
    try {
      console.log('🧪 Testing orders API connectivity...');

      // Primero intentar obtener todas las órdenes sin filtros
      const allOrders = await this.getOrders({
        per_page: 10,
        status: 'any'
      });

      console.log('🧪 All orders test result:', allOrders);

      // Intentar obtener órdenes específicas que sabemos que existen
      try {
        const order333 = await this.getOrder(333);
        console.log('🧪 Order 333 found:', order333);
      } catch (error) {
        console.log('🧪 Order 333 not accessible:', error);
      }

      try {
        const order334 = await this.getOrder(334);
        console.log('🧪 Order 334 found:', order334);
      } catch (error) {
        console.log('🧪 Order 334 not accessible:', error);
      }

      return allOrders;
    } catch (error) {
      console.error('🧪 API test failed:', error);
      throw error;
    }
  }
}

// Función helper para convertir WooCommerceOrder a Order (formato del componente)
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
