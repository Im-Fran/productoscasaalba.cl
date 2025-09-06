import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import type {Product, Category} from "@/types/product";
import {LoadingRelatedProducts} from "@/pages/products/components/related-products/loading-related-products.tsx";
import {RelatedProductCard} from "@/pages/products/components/related-products/related-product-card.tsx";

interface RelatedProductsProps {
  categories: Category[];
  currentProductId: number;
}

export const RelatedProducts = ({ categories, currentProductId }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categories || categories.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get products from the same categories
        const categoryIds = categories.map(cat => cat.id).join(',');
        const response = await axios.get(`/api/wp-json/wc/store/v1/products?category=${categoryIds}&per_page=4&exclude=${currentProductId}`);

        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categories, currentProductId]);

  if (loading) {
    return <LoadingRelatedProducts/>;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Productos Relacionados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => <RelatedProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};
