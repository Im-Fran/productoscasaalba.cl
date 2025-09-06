import {useState, useEffect, useCallback} from 'react';
import { Hero } from '@/pages/home/components/hero.tsx';
import { SearchBox } from '@/pages/home/components/search-box.tsx';
import { CategoryList } from '@/pages/home/components/category-list.tsx';
import { ProductGrid } from '@/components/product-grid/product-grid.tsx';
import type {Product} from "@/types/product";
import axios from '@/utils/axios';
import {Banner} from '@/components/banner';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[] | null | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategoryChange = (categories: number[]) => {
    setSelectedCategories(categories);
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
    fetchProducts()
  }, [selectedCategories, fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sección de búsqueda */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Encuentra el producto perfecto
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Busca entre nuestra amplia variedad de productos de agua purificada
          </p>
          <SearchBox
            onSearch={fetchProducts}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con categorías */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <CategoryList
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
          {/* Grid de productos */}
          <div className="lg:col-span-3">
            <Banner />
            <ProductGrid
              products={products}
              refetchProducts={fetchProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}