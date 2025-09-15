import {useCallback, useEffect, useState} from 'react';
import { CategoryList } from '../home/components/category-list';
import { SearchBox } from '../home/components/search-box';
import { ProductGrid } from '../../components/product-grid/product-grid.tsx';
import axios from "axios";
import type {Product} from "@/types/product";
import {Banner} from '@/components/banner';

export const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[] | null | undefined>(undefined);

  const handleCategoryChange = (categories: number[]) => {
    setSelectedCategories(categories);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery(null);
  };

  const fetchProducts = useCallback((search: string | undefined | null = undefined) => {
    setProducts(undefined)
    const params = new URLSearchParams();

    if (search !== undefined && search !== null) {
      params.append('search', search);
    }

    if (selectedCategories && selectedCategories.length > 0) {
      params.append('category', selectedCategories.join(','));
    }

    axios.get(`/api/wp-json/wc/store/v1/products?${params.toString()}`).then((response) => {
      setProducts(response.data)
    }).catch(() => {
      setProducts(null)
    })
  }, [selectedCategories]);

  useEffect(() => {
    fetchProducts(searchQuery)
  }, [selectedCategories, fetchProducts, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Todos los Productos</h1>
          <p className="text-gray-600">Encuentra todos nuestros productos de agua purificada</p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar izquierdo - Filtros */}
          <div className="col-span-4 space-y-6">
            {/* Filtros activos */}
            {(selectedCategories.length > 0 || searchQuery) && <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Filtros Activos</h3>
                    <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800">Limpiar todos</button>
                </div>

                <div className="space-y-2">
                  {searchQuery && (
                    <div className="flex items-center justify-between bg-mint-50 border border-mint-200 rounded px-3 py-2">
                      <span className="text-sm text-mint-800">
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
                        <span className="text-sm text-green-800 font-medium">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Buscar Productos</h3>
              <SearchBox
                onSearch={handleSearch}
              />
            </div>

            {/* Contenedor flotante para categorías */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <CategoryList
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* Contenido principal - Grid de productos */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
                  <div className="text-sm text-gray-500">
                    {selectedCategories.length > 0 || searchQuery ? 'Resultados filtrados' : 'Todos los productos'}
                  </div>
                </div>
              </div>

              <ProductGrid
                products={products}
                refetchProducts={fetchProducts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
