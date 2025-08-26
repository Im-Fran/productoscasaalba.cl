import type {Image} from "@/types/wordpress";

export const defaultCart: WooCommerceCart = {
  items: [],
  coupons: [],
  fees: [],
  totals: {
    total_items: '0',
    total_items_tax: '0',
    total_fees: '0',
    total_fees_tax: '0',
    total_discount: '0',
    total_discount_tax: '0',
    total_shipping: '0',
    total_shipping_tax: '0',
    total_price: '0',
    total_tax: '0',
    tax_lines: [],
    currency_code: 'USD',
    currency_symbol: '$',
    currency_minor_unit: 2,
    currency_decimal_separator: '.',
    currency_thousand_separator: ',',
    currency_prefix: '$',
    currency_suffix: '',
  },
  shipping_address: null,
  billing_address: null,
  needs_payment: false,
  needs_shipping: false,
  payment_requirements: [],
  has_calculated_shipping: false,
  shipping_rates: [],
  items_count: 0,
  items_weight: 0,
  cross_sells: [],
  errors: [],
  payment_methods: [],
}

export type QuantityLimits = {
  minimum: number;
  maximum: number;
  multiple_of: number;
  editable: boolean;
}

export type RawPrices = {
  precision: number;
  price: string;
  regular_price: string;
  sale_price: string;
}

export type Prices = {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: never | null;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
  raw_prices: RawPrices;
}

export type CartItemTotals = {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export type CartItem = {
  key: string;
  id: number;
  quantity: number;
  quantity_limits: QuantityLimits;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  low_stock_remaining: number | null;
  backorders_allowed: boolean;
  show_backorder_badge: boolean;
  sold_individually: boolean;
  permalink: string;
  images: Image[];
  variation: never | null[];
  item_data: never | null[];
  prices: Prices;
  totals: CartItemTotals;
  catalog_visibility: string;
}

export type WooCommerceCoupon = {
  code: string;
  discount_type: string;
  totals: WooCommerceCouponTotals;
}

export type WooCommerceCouponTotals = {
  total_discount: string;
  total_discount_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export type WooCommerceCartTotals = {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_price: string;
  total_tax: string;
  tax_lines: TaxLine[];
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export type TaxLine = {
  name: string;
  price: string;
  rate: string;
}

export type WooCommerceCart = {
  items: CartItem[];
  coupons: WooCommerceCoupon[];
  fees: never | null[];
  totals: WooCommerceCartTotals;
  shipping_address: never | null;
  billing_address: never | null;
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_requirements: string[];
  has_calculated_shipping: boolean;
  shipping_rates: never | null[];
  items_count: number;
  items_weight: number;
  cross_sells: never | null[];
  errors: never | null[];
  payment_methods: string[];
}