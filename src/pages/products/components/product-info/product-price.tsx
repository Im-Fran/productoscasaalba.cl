import type {Product} from "@/types/product";

export type ProductPriceProps = {
  product: Product
}

export const ProductPrice = ({product}: ProductPriceProps) => {
  const hasDiscount = product.prices.sale_price && product.prices.sale_price !== product.prices.regular_price;

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString('es-CL');
  };

  return <div className="space-y-2">
    <div className="flex items-center space-x-3">
      {hasDiscount ? <>
        <span className="text-3xl font-bold text-mint-900">
          {product.prices.currency_symbol}{formatPrice(product.prices.sale_price)}
        </span>
        <span className="text-xl text-gray-500 line-through">
          {product.prices.currency_symbol}{formatPrice(product.prices.regular_price)}
        </span>
        </> : <span className="text-3xl font-bold text-mint-900">{product.prices.currency_symbol}{formatPrice(product.prices.price)}</span>
      }
    </div>
    <p className="text-sm text-gray-600">IVA. Incl</p>
  </div>
}