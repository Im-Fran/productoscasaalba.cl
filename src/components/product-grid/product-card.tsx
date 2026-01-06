import type {Product} from "@/types/product";
import {Link} from "react-router";

export const ProductCard = ({product}: { product: Product }) => {

  const isOnSale = product.prices?.sale_price && product.prices?.regular_price !== product.prices?.sale_price && product.on_sale;

  return <Link to={`/productos/${product.slug}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative">
      <img
        src={product.images?.[0]?.src || '/placeholder-product.jpg'}
        alt={product.images?.[0]?.alt || product.name}
        className="w-full h-48 md:h-64 lg:h-72 object-cover"
      />
      {isOnSale && (<span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">Oferta</span>)}
    </div>
    <div className="p-3 md:p-4">
      <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
      <div className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{__html: product.short_description || ''}}/>
      <div className="flex items-center justify-between">
        <div className="text-base md:text-lg font-bold text-green-600">
          {product.prices?.currency_symbol}{product.prices?.price}
          {isOnSale && (<span className="text-xs md:text-sm text-gray-400 line-through ml-2">{product.prices?.currency_symbol}{product.prices?.regular_price}</span>)}
        </div>
        <button className="bg-mint-600 text-white px-3 py-1 rounded text-sm hover:bg-mint-700">
          Ver
        </button>
      </div>
    </div>
  </Link>
}