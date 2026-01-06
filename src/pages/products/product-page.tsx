import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { ProductGallery } from '@/pages/products/components/product-gallery.tsx';
import { ProductInfo } from '@/pages/products/components/product-info/product-info.tsx';
import { ProductTabs } from '@/pages/products/components/product-tabs.tsx';
import { RelatedProducts } from '@/pages/products/components/related-products/related-products.tsx';
import type {Product} from "@/types/product";
import axios from "@/utils/axios";
import {LoadingProductPage} from "@/pages/products/loading-product-page.tsx";

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true)
    setError(null)

    axios.get(`/api/wp-json/wc/store/v1/products/${slug}`).then((response) => {
      if(response.status !== 200){
        setError('Producto no encontrado');
        setLoading(false);
        return;
      }

      setProduct(response.data);
    }).catch((error) => {
      console.error('Error fetching product:', error);
      if(error.response && error.response.status === 404){
        setError('Producto no encontrado');
        return;
      }

      setError('Error al obtener producto')
    }).finally(() => {
      setLoading(false);
    })
  }, [slug]);

  if (loading) {
    return <LoadingProductPage/>;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            {error || 'Producto no encontrado'}
          </div>
          <p className="text-gray-600 mb-4">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <a
            href="/public"
            className="bg-mint-600 text-white px-6 py-2 rounded-lg hover:bg-mint-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Product main section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        {product.images && <ProductGallery images={product.images} productName={product.name}/>}
        <ProductInfo product={product} />
      </div>

      {/* Product tabs */}
      {product.description && product.attributes && <ProductTabs
        description={product.description}
        attributes={product.attributes}
        ratingCount={product.review_count || 0}
        averageRating={product.average_rating || "0"}
      />}

      {/* Related products */}
      {product.categories && <RelatedProducts
        categories={product.categories}
        currentProductId={product.id}
      />}
    </div>
  );
};
