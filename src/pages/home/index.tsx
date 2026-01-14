import {useState, useEffect, useCallback} from 'react';
import { Hero } from '@/pages/home/components/hero.tsx';
import { SearchBox } from '@/pages/home/components/search-box.tsx';
import { CategoryList } from '@/pages/home/components/category-list.tsx';
import { ProductGrid } from '@/components/product-grid/product-grid.tsx';
import { Pagination } from '@/components/Pagination.tsx';
import type {Product} from "@/types/product";
import axios from '@/utils/axios';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[] | null | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

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
      // Extract total pages from headers
      const totalPagesHeader = response.headers['x-wp-totalpages'];
      if (totalPagesHeader) {
        setTotalPages(parseInt(totalPagesHeader, 10));
      } else {
        setTotalPages(1);
      }
    }).catch(() => {
      setProducts(null)
      setTotalPages(1);
    })
  }, [selectedCategories, perPage]);

  const handleCategoryChange = useCallback((categories: number[]) => {
    setSelectedCategories(categories);
    setPage(1); // Reset to first page when categories change
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((search: string) => {
    setPage(1);
    fetchProducts(search, 1);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(undefined, page)
  }, [fetchProducts, page]);

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
            {/* Pagination */}
            {products && products.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}