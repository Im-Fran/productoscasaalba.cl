import {useState, useEffect, useCallback} from 'react';
import { Hero } from '@/pages/home/components/hero.tsx';
import { SearchBox } from '@/pages/home/components/search-box.tsx';
import { CategoryList } from '@/pages/home/components/category-list.tsx';
import { ProductGrid } from '@/components/product-grid/product-grid.tsx';
import type {Product} from "@/types/product";
import axios from '@/utils/axios';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[] | null | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 12;

  const handleCategoryChange = (categories: number[]) => {
    setSelectedCategories(categories);
    setPage(1); // Reset to first page when categories change
  };

  const fetchProducts = useCallback((search: string | undefined | null = undefined, currentPage: number = 1) => {
    setProducts(undefined)
    const params = new URLSearchParams();

    params.append('_fields', 'id,name,slug,images,prices,short_description,on_sale');
    params.append('per_page', perPage.toString());
    params.append('page', currentPage.toString());

    if (search !== undefined && search !== null) {
      params.append('search', search);
    }

    if (selectedCategories && selectedCategories.length > 0) {
      params.append('category', selectedCategories.join(','));
    }

    axios.get(`/api/wp-json/wc/store/v1/products?${params.toString()}`).then((response) => {
      setProducts(response.data)
      setHasMore(response.data.length === perPage);
    }).catch(() => {
      setProducts(null)
      setHasMore(false);
    })
  }, [selectedCategories]);

  useEffect(() => {
    fetchProducts(undefined, page)
  }, [selectedCategories, page, fetchProducts]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleSearch = (search: string) => {
    setPage(1);
    fetchProducts(search, 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Sección de búsqueda */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mint-1150 mb-4 md:mb-6">
            Encuentra el producto perfecto
          </h2>
          <SearchBox
            onSearch={handleSearch}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar con categorías */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:sticky lg:top-4">
              <CategoryList
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
          {/* Grid de productos */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              refetchProducts={() => fetchProducts(undefined, page)}
            />
            {/* Load More Button */}
            {products && products.length > 0 && hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-mint-600 hover:bg-mint-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cargar más productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}