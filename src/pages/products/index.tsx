import {useCallback, useEffect, useState} from 'react';
import { CategoryList } from '@/pages/home/components/category-list.tsx';
import { SearchBox } from '@/pages/home/components/search-box.tsx';
import axios from "@/utils/axios";
import type {Product} from "@/types/product";
import {ProductGrid} from "@/components/product-grid/product-grid.tsx";

export const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[] | null | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 12;

  const fetchProducts = useCallback((search: string | undefined | null = undefined, currentPage: number = 1) => {
    setProducts(undefined)
    const params = new URLSearchParams();

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
  }, [selectedCategories, perPage]);

  const handleCategoryChange = useCallback((categories: number[]) => {
    setSelectedCategories(categories);
    setPage(1); // Reset to first page when categories change
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSearchQuery(null);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchProducts(searchQuery, page)
  }, [fetchProducts, searchQuery, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Sidebar izquierdo - Filtros */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            {/* Filtros activos */}
            {(selectedCategories.length > 0 || searchQuery) && <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Filtros Activos</h3>
                    <button onClick={clearFilters} className="text-xs md:text-sm text-red-600 hover:text-red-800">Limpiar todos</button>
                </div>

                <div className="space-y-2">
                  {searchQuery && (
                    <div className="flex items-center justify-between bg-mint-50 border border-mint-200 rounded px-3 py-2">
                      <span className="text-xs md:text-sm text-mint-800">
                        Búsqueda: "{searchQuery}"
                      </span>
                      <button onClick={() => setSearchQuery('')} className="text-mint-600 hover:text-mint-800">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {selectedCategories.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-green-800 font-medium">
                          Categorías ({selectedCategories.length})
                        </span>

                        <button onClick={() => setSelectedCategories([])} className="text-green-600 hover:text-green-800">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
            </div>}

            {/* Contenedor flotante para búsqueda */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Buscar</h3>
              <SearchBox
                onSearch={handleSearch}
              />
            </div>

            {/* Contenedor flotante para categorías */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <CategoryList
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* Contenido principal - Grid de productos */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <ProductGrid
                products={products}
                refetchProducts={() => fetchProducts(searchQuery, page)}
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
    </div>
  );
}
