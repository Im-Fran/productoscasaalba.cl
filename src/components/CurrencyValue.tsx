import { formatPrice } from '@/utils/price-formatting';

interface CurrencyValueProps {
  value?: string | number;
  children?: string | number;
}

/**
 * Componente para formatear valores en pesos chilenos (CLP)
 *
 * @example
 * <CurrencyValue value={1000} /> // Renderiza: $1.000
 * <CurrencyValue>1000</CurrencyValue> // Renderiza: $1.000
 */
export default function CurrencyValue({ value, children }: CurrencyValueProps) {
  // Determinar qué valor usar (value o children)
  const priceValue = value !== undefined ? value : children;

  // Si no hay valor, retornar $0
  if (priceValue === undefined || priceValue === null) {
    return <>$0</>;
  }

  // Configuración para pesos chilenos (CLP)
  const clpOptions = {
    currency_code: 'CLP',
    currency_symbol: '$',
    currency_minor_unit: 0, // CLP no tiene decimales
    currency_decimal_separator: ',',
    currency_thousand_separator: '.',
    currency_prefix: '$',
    currency_suffix: '',
  };

  // Formatear el precio
  const formattedPrice = formatPrice(priceValue, clpOptions);

  return <>{formattedPrice}</>;
}

