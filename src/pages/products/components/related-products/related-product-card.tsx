import type {Product} from "@/types/product";
import {Link} from "react-router";

export const RelatedProductCard = ({ product }: { product: Product }) => {
  const defaultImage = product.images?.[0];

  return (
    <Link to={`/productos/${product.slug}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group block">
      {/* Product image */}
      <div className="relative overflow-hidden">
        {defaultImage ? (
          <img
            src={defaultImage.thumbnail}
            alt={defaultImage.alt || product.name}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-mint-900">
            {product.prices.currency_symbol}{parseInt(product.prices.price).toLocaleString('es-CL')}
          </div>

          <button className="bg-mint-600 text-white px-3 py-1 rounded text-sm hover:bg-mint-700 transition-colors">
            Ver
          </button>
        </div>
      </div>
    </Link>
  );
};