import axiosInstance from '@/utils/axios';
import { CART_TOKEN_KEY } from "@/contexts/CartContext.tsx";

export interface PaymentMethod {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface CheckoutPaymentResponse {
  payment_method: string;
  __experimentalCart: {
    payment_methods: string[];
    needs_payment: boolean;
    // ...otras propiedades del carrito
  };
}

export interface CheckoutOrderResponse {
  order_id: number;
  status: string;
  order_key: string;
  order_number: string;
  customer_note: string;
  customer_id: number;
  billing_address: Record<string, string>;
  shipping_address: Record<string, string>;
  payment_method: string;
  payment_result: {
    redirect_url?: string;
    payment_status?: string;
  } | null;
  additional_fields: Record<string, unknown>;
  __experimentalCart: Record<string, unknown>;
  extensions: Record<string, unknown>;
}

export class PaymentService {
  private static readonly CHECKOUT_URL = '/api/wp-json/wc/store/v1/checkout';

  /**
   * Obtener métodos de pago disponibles desde el checkout
   */
  static async getPaymentMethods(): Promise<{ methods: PaymentMethod[], selectedMethodId: string | null }> {
    try {
      const cartToken = localStorage.getItem(CART_TOKEN_KEY);

      // Hacer solicitud PUT al endpoint de checkout para obtener métodos de pago
      const response = await axiosInstance.put(`${this.CHECKOUT_URL}`, {}, {
        headers: {
          'Cart-Token': cartToken || '',
        },
        withCredentials: true,
      });

      const checkoutData: CheckoutPaymentResponse = response.data;

      if (!checkoutData.__experimentalCart?.payment_methods) {
        console.warn('No se pudieron obtener los métodos de pago');
        return {
          methods: this.getFallbackPaymentMethods(),
          selectedMethodId: null
        };
      }

      // Mapear los IDs de métodos de pago a objetos con información completa
      const methods = checkoutData.__experimentalCart.payment_methods.map(methodId => {
        return this.getPaymentMethodInfo(methodId);
      });

      // Obtener el método de pago seleccionado actualmente
      const selectedMethodId = checkoutData.payment_method || null;

      return { methods, selectedMethodId };
    } catch (error) {
      console.error('Error getting payment methods from checkout:', error);
      return {
        methods: this.getFallbackPaymentMethods(),
        selectedMethodId: null
      };
    }
  }

  /**
   * Obtener información detallada de un método de pago por su ID
   */
  private static getPaymentMethodInfo(methodId: string): PaymentMethod {
    const paymentMethodsInfo: { [key: string]: PaymentMethod } = {
      'woo-mercado-pago-basic': {
        id: 'woo-mercado-pago-basic',
        title: 'Mercado Pago',
        description: 'Paga de forma segura con Mercado Pago. Aceptamos tarjetas de crédito, débito y más.',
        icon: '💳'
      },
      'bacs': {
        id: 'bacs',
        title: 'Transferencia Bancaria',
        description: 'Realiza el pago directamente desde tu cuenta bancaria.',
        icon: '🏦'
      },
      'cod': {
        id: 'cod',
        title: 'Pago contra entrega',
        description: 'Paga en efectivo al recibir tu pedido.',
        icon: '💵'
      },
      'cheque': {
        id: 'cheque',
        title: 'Pago con cheque',
        description: 'Envía un cheque a nuestra dirección.',
        icon: '📝'
      },
      'paypal': {
        id: 'paypal',
        title: 'PayPal',
        description: 'Paga de forma segura con tu cuenta PayPal.',
        icon: '🅿️'
      }
    };

    return paymentMethodsInfo[methodId] || {
      id: methodId,
      title: this.formatMethodTitle(methodId),
      description: 'Método de pago disponible',
      icon: '💳'
    };
  }

  /**
   * Formatear el ID del método de pago en un título legible
   */
  private static formatMethodTitle(methodId: string): string {
    return methodId
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Métodos de pago por defecto como fallback
   */
  private static getFallbackPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'woo-mercado-pago-basic',
        title: 'Mercado Pago',
        description: 'Paga de forma segura con Mercado Pago. Aceptamos tarjetas de crédito, débito y más.',
        icon: '💳'
      }
    ];
  }

  /**
   * Seleccionar y guardar un método de pago en el checkout
   */
  static async selectPaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      const cartToken = localStorage.getItem(CART_TOKEN_KEY);

      // Hacer solicitud PUT para actualizar el método de pago en el checkout
      await axiosInstance.put(this.CHECKOUT_URL, {
        payment_method: paymentMethodId
      }, {
        headers: {
          'Cart-Token': cartToken || '',
        }
      });

      return true;
    } catch (error) {
      console.error('Error selecting payment method:', error);
      return false;
    }
  }

  /**
   * Procesar el pedido (checkout)
   */
  static async processOrder(orderData: {
    billing_address: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
    shipping_address: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      phone: string;
    };
    payment_method: string;
    customer_note?: string;
  }): Promise<CheckoutOrderResponse> {
    try {
      const cartToken = localStorage.getItem(CART_TOKEN_KEY);

      const response = await axiosInstance.post(this.CHECKOUT_URL, {
        ...orderData,
        set_paid: false,
      }, {
        headers: {
          'Cart-Token': cartToken || '',
        }
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Error processing order:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message ||
        'Error al procesar el pedido. Por favor, intenta nuevamente.'
      );
    }
  }
}
