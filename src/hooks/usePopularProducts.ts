import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import type { Product } from '@/types/product';

export const usePopularProducts = (limit: number = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using WooCommerce Store API with per_page parameter to limit results
        // We'll sort by menu_order which typically shows popular products in WooCommerce
        const response = await axios.get(
          `/api/wp-json/wc/store/v1/products?per_page=${limit}&orderby=menu_order&order=asc&_fields=id,name,slug,images,prices,on_sale`
        );
        
        setProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching popular products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch popular products'));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, [limit]);

  return { products, loading, error };
};
