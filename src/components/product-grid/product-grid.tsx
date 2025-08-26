import type {Product} from "@/types/product";
import {ProductCard} from "@/components/product-grid/product-card.tsx";
import {LoadingProductGrid} from "@/components/product-grid/loading-product-grid.tsx";

export type ProductGridProps = {
  products: Product[] | undefined | null;
  refetchProducts: () => void;
}

export const ProductGrid = ({ products, refetchProducts }: ProductGridProps) => {
  if (products === undefined) {
    return <LoadingProductGrid/>;
  }

  if (products === null) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">¡Ocurrió un error al cargar los productos!</p>
        <button onClick={refetchProducts} className="mt-4 px-4 py-2 bg-mint-600 text-white rounded hover:bg-mint-700">
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se encontraron productos</p>
      </div>
    );
  }

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => <ProductCard product={product} key={`product-card-${product.id}`}/>)}
  </div>;
};

