import React, {createContext, useContext, useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import axios, {type AxiosResponse} from 'axios';
import type {WooCommerceCart} from '@/types/woo-commerce';
import {defaultCart} from '@/types/woo-commerce';
import toast from "react-hot-toast";

interface CartContextType {
  cart: WooCommerceCart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemKey: string, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  removeCoupon: (couponCode: string) => Promise<void>;
  clearCart: () => Promise<void>;
  formatPrice: (price: string | number, options?: FormatPriceOptions) => string;
}

interface FormatPriceOptions {
  currency_code?: string;
  currency_symbol?: string;
  currency_minor_unit?: number;
  currency_decimal_separator?: string;
  currency_thousand_separator?: string;
  currency_prefix?: string;
  currency_suffix?: string;
  showDecimals?: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Constants for localStorage
const CART_TOKEN_KEY = 'woo_cart_token';

// Helper functions for cart token management
const getCartToken = (): string | null => {
  return localStorage.getItem(CART_TOKEN_KEY);
};

const setCartToken = (token: string): void => {
  localStorage.setItem(CART_TOKEN_KEY, token);
};

// Helper function to get axios config with cart token
const getAxiosConfig = () => {
  const token = getCartToken();
  return token ? {
    headers: {
      'Cart-Token': token
    }
  } : {};
};

// Helper function to extract and save cart token from response
const handleCartTokenResponse = (response: AxiosResponse) => {
  const cartToken = response.headers?.['cart-token'] || response.headers?.['Cart-Token'];
  if (cartToken) {
    setCartToken(cartToken);
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<WooCommerceCart | null>(null);
  const [loading, setLoading] = useState(false);

  // Enhanced price formatting function that handles WooCommerce price structure
  const formatPrice = (
    price: string | number,
    options?: FormatPriceOptions
  ): string => {
    // Use cart's currency settings as defaults, or fallback to USD defaults
    const defaults = cart?.totals || {
      currency_code: 'USD',
      currency_symbol: '$',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: '$',
      currency_suffix: '',
    };

    const {
      currency_minor_unit = defaults.currency_minor_unit,
      currency_decimal_separator = defaults.currency_decimal_separator,
      currency_thousand_separator = defaults.currency_thousand_separator,
      currency_prefix = defaults.currency_prefix,
      currency_suffix = defaults.currency_suffix,
      showDecimals = currency_minor_unit > 0
    } = options || {};

    // Convert price to number
    let numericPrice: number;
    if (typeof price === 'string') {
      // WooCommerce stores prices as strings in minor units (e.g., "1500" for $15.00 when minor_unit is 2)
      numericPrice = parseInt(price) / Math.pow(10, currency_minor_unit);
    } else {
      numericPrice = price;
    }

    // Handle NaN case
    if (isNaN(numericPrice)) {
      return `${currency_prefix}0${currency_suffix}`;
    }

    // Format the number with appropriate decimal places
    const decimalPlaces = showDecimals ? currency_minor_unit : 0;
    const fixedPrice = numericPrice.toFixed(decimalPlaces);

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = fixedPrice.split('.');

    // Add thousand separators to integer part
    // Combine parts
    let formattedPrice = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency_thousand_separator);
    if (decimalPart && showDecimals) {
      formattedPrice += currency_decimal_separator + decimalPart;
    }

    // Add prefix and suffix
    return `${currency_prefix}${formattedPrice}${currency_suffix}`;
  };

  const refreshCart = async () => {
    setLoading(true);
    
    try {
      const response = await axios.get('/api/wp-json/wc/store/v1/cart', getAxiosConfig());
      handleCartTokenResponse(response);
      setCart(response.data);
    } catch (err: unknown) {
      console.error('Error fetching cart:', err);
      toast.error('Error al obtener el carrito');
      setCart(defaultCart);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/wp-json/wc/store/v1/cart/add-item', {
        id: productId,
        quantity: quantity,
      }, getAxiosConfig());
      handleCartTokenResponse(response);
      await refreshCart();
    } catch (err: unknown) {
      console.error('Error adding item to cart:', err);
      toast.error('Error al agregar producto al carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemKey: string, quantity: number) => {
    setLoading(true);
    
    try {
      if (quantity <= 0) {
        await removeItem(itemKey);
        return;
      }

      const response = await axios.post('/api/wp-json/wc/store/v1/cart/update-item', {
        key: itemKey,
        quantity: quantity,
      }, getAxiosConfig());
      handleCartTokenResponse(response);
      await refreshCart();
    } catch (err: unknown) {
      console.error('Error updating item quantity:', err);
      toast.error('Error al actualizar cantidad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemKey: string) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/wp-json/wc/store/v1/cart/remove-item', {
        key: itemKey,
      }, getAxiosConfig());
      handleCartTokenResponse(response);
      await refreshCart();
    } catch (err: unknown) {
      console.error('Error removing item from cart:', err);
      toast.error('Error al eliminar producto del carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/wp-json/wc/store/v1/cart/apply-coupon', {
        code: couponCode,
      }, getAxiosConfig());
      handleCartTokenResponse(response);
      await refreshCart();
      return true;
    } catch (err: unknown) {
      console.error('Error applying coupon:', err);
      toast.error('Cupón no válido o error al aplicar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async (couponCode: string) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/wp-json/wc/store/v1/cart/remove-coupon', {
        code: couponCode,
      }, getAxiosConfig());
      handleCartTokenResponse(response);
      await refreshCart();
    } catch (err: unknown) {
      console.error('Error removing coupon:', err);
      toast.error('Error al remover cupón');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    
    try {
      const response = await axios.delete('/api/wp-json/wc/store/v1/cart/items', getAxiosConfig());
      handleCartTokenResponse(response);
      await refreshCart();
    } catch (err: unknown) {
      console.error('Error clearing cart:', err);
      toast.error('Error al limpiar carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
    formatPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
