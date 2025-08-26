import type {Prices, WooCommerceCartTotals} from '@/types/woo-commerce';

export interface FormatPriceOptions {
  currency_code?: string;
  currency_symbol?: string;
  currency_minor_unit?: number;
  currency_decimal_separator?: string;
  currency_thousand_separator?: string;
  currency_prefix?: string;
  currency_suffix?: string;
  showDecimals?: boolean;
}

/**
 * Formats a price according to WooCommerce price structure
 * @param price - The price as string or number
 * @param options - Currency formatting options (can be from Prices or WooCommerceCartTotals)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: string | number,
  options: FormatPriceOptions | Prices | WooCommerceCartTotals = {}
): string => {
  // Default currency settings (USD)
  const defaults = {
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
  } = { ...defaults, ...options };

  // Convert price to number
  let numericPrice: number;
  if (typeof price === 'string') {
    // WooCommerce stores prices as strings in minor units
    // e.g., "1500" for $15.00 when currency_minor_unit is 2
    // or "1500" for $1500 when currency_minor_unit is 0 (like CLP)
    numericPrice = parseInt(price) / Math.pow(10, currency_minor_unit);
  } else {
    numericPrice = price;
  }

  // Handle NaN case
  if (isNaN(numericPrice)) {
    return `${currency_prefix}0${currency_suffix}`;
  }

  // Format the number with appropriate decimal places
  const fixedPrice = numericPrice.toFixed(currency_minor_unit);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixedPrice.split('.');

  // Add thousand separators to integer part
  // Combine parts
  let formattedPrice = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency_thousand_separator);
  if (decimalPart) {
    formattedPrice += currency_decimal_separator + decimalPart;
  }

  // Add prefix and suffix
  return `${currency_prefix}${formattedPrice}${currency_suffix}`;
};

/**
 * Formats a price range (min - max)
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param options - Currency formatting options
 * @returns Formatted price range string
 */
export const formatPriceRange = (
  minPrice: string | number,
  maxPrice: string | number,
  options: FormatPriceOptions = {}
): string => {
  const formattedMin = formatPrice(minPrice, options);
  const formattedMax = formatPrice(maxPrice, options);

  if (minPrice === maxPrice) {
    return formattedMin;
  }

  return `${formattedMin} - ${formattedMax}`;
};

/**
 * Get the numeric value of a price (without currency formatting)
 * @param price - The price as string or number
 * @param currencyMinorUnit - The currency minor unit (default: 2)
 * @returns Numeric price value
 */
export const getPriceValue = (price: string | number, currencyMinorUnit: number = 2): number => {
  if (typeof price === 'string') {
    return parseInt(price) / Math.pow(10, currencyMinorUnit);
  }
  return price;
};

/**
 * Check if a product is on sale
 * @param regularPrice - Regular price
 * @param salePrice - Sale price
 * @returns True if product is on sale
 */
export const isOnSale = (regularPrice: string, salePrice: string): boolean => {
  return regularPrice !== salePrice && parseInt(salePrice) < parseInt(regularPrice);
};

/**
 * Calculate discount percentage
 * @param regularPrice - Regular price
 * @param salePrice - Sale price
 * @param currencyMinorUnit - Currency minor unit
 * @returns Discount percentage as number
 */
export const getDiscountPercentage = (
  regularPrice: string,
  salePrice: string,
  currencyMinorUnit: number = 2
): number => {
  const regular = getPriceValue(regularPrice, currencyMinorUnit);
  const sale = getPriceValue(salePrice, currencyMinorUnit);

  if (regular <= 0) return 0;

  return Math.round(((regular - sale) / regular) * 100);
};
