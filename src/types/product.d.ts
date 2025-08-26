import type {Image} from "@/types/wordpress";

export type Term = {
  id: number;
  name: string;
  slug: string;
}

export type Category = {
  id: number;
  name: string;
  slug: string;
  link?: string;
}

export type Attribute = {
  id: number;
  name: string;
  taxonomy: string | null;
  has_variations: boolean;
  terms: Term[];
}

export type Price = {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: null;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export type StockAvailability = {
  text: string;
  class: string;
}

export type AddToCart = {
  text: string;
  description: string;
  url: string;
  single_text: string;
  minimum: number;
  maximum: number;
  multiple_of: number;
}

export type VariationAttribute = {
  name: string;
  value: string;
}

export type Variation = {
  id: number;
  attributes: VariationAttribute[];
}

export type Product = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: string;
  variation: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: Price;
  price_html: string;
  average_rating: string;
  review_count: number;
  images: Image[];
  categories: Category[];
  tags: unknown[];
  brands: unknown[];
  attributes: Attribute[];
  variations: Variation[];
  grouped_products: unknown[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: null;
  stock_availability: StockAvailability;
  sold_individually: boolean;
  add_to_cart: AddToCart;
  extensions: Record<string, unknown>;
}