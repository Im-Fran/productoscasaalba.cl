import axiosInstance from '@/utils/axios';
import {CART_TOKEN_KEY} from "@/contexts/CartContext.tsx";

export interface ShippingRate {
  rate_id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  meta_data: Array<{
    key: string;
    value: string;
  }>;
  selected: boolean;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface ShippingPackage {
  package_id: number;
  name: string;
  destination: {
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: Array<{
    key: string;
    name: string;
    quantity: number;
  }>;
  shipping_rates: ShippingRate[];
}

export interface CheckoutResponse {
  __experimentalCart: {
    shipping_rates: ShippingPackage[];
    has_calculated_shipping: boolean;
    needs_shipping: boolean;
    // ...otras propiedades del carrito
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  method_id: string;
  selected: boolean;
  currency_symbol: string;
  currency_prefix: string;
}

export class ShippingService {
  private static readonly CHECKOUT_URL = '/api/wp-json/wc/store/v1/checkout';

  /**
   * Obtener opciones de envío actualizadas desde el checkout
   * Este endpoint calcula los precios reales basándose en el carrito actual
   */
  static async getShippingOptions(): Promise<ShippingOption[]> {
    try {
      const cartToken = localStorage.getItem(CART_TOKEN_KEY)
      // Hacer solicitud PUT al endpoint de checkout para calcular totales
      const response = await axiosInstance.put(`${this.CHECKOUT_URL}?__experimental_calc_totals`, {}, {
        headers: {
          'Cart-Token': cartToken || '',
        }
      });
      const checkoutData: CheckoutResponse = response.data;

      if (!checkoutData.__experimentalCart?.shipping_rates ||
          !checkoutData.__experimentalCart.has_calculated_shipping) {
        console.warn('No se pudieron calcular las opciones de envío');
        return this.getFallbackShippingOptions();
      }

      // Extraer todas las opciones de envío de todos los paquetes
      const allShippingOptions: ShippingOption[] = [];

      checkoutData.__experimentalCart.shipping_rates.forEach(shippingPackage => {
        shippingPackage.shipping_rates.forEach(rate => {
          allShippingOptions.push({
            id: rate.rate_id,
            name: rate.name,
            description: rate.description || rate.delivery_time || '',
            delivery_time: rate.delivery_time || '',
            price: rate.price,
            method_id: rate.method_id,
            selected: rate.selected,
            currency_symbol: rate.currency_symbol,
            currency_prefix: rate.currency_prefix,
          });
        });
      });

      return allShippingOptions;
    } catch (error) {
      console.error('Error getting shipping options from checkout:', error);
      return this.getFallbackShippingOptions();
    }
  }

  /**
   * Opciones de envío por defecto como fallback
   */
  private static getFallbackShippingOptions(): ShippingOption[] {
    return [
      {
        id: 'flat_rate:1',
        name: 'Envío a Domicilio (2 días hábiles)',
        description: '',
        delivery_time: '',
        price: '2000',
        method_id: 'flat_rate',
        selected: true,
        currency_symbol: '$',
        currency_prefix: '$',
      },
    ];
  }

  /**
   * Seleccionar una opción de envío específica
   */
  static async selectShippingRate(rateId: string, packageId: number = 0): Promise<boolean> {
    try {
      await axiosInstance.post('/api/wp-json/wc/store/v1/cart/select-shipping-rate', {
        rate_id: rateId,
        package_id: packageId,
      });
      return true;
    } catch (error) {
      console.error('Error selecting shipping rate:', error);
      return false;
    }
  }
}
