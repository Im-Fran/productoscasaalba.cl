import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import type {Category} from "@/types/product";

interface CategoryListProps {
  selectedCategories: number[];
  onCategoryChange: (categories: number[]) => void;
}

export const CategoryList = ({ selectedCategories, onCategoryChange }: CategoryListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/wp-json/wc/store/v1/products/categories?_fields=id,name,slug,count&order=asc&orderby=name');

        const data: Category[] = response.data;

        const transformedCategories: Category[] = data.map((category: Category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          count: category.count || 0,
        }));

        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId: number) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newSelection);
  };

  const clearAllCategories = () => {
    onCategoryChange([]);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-6 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={clearAllCategories}
            className="text-sm text-mint-600 hover:text-mint-800"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryToggle(category.id)}
              className="rounded border-gray-300 text-mint-600 focus:ring-mint-500"
            />
            <span className="text-sm text-gray-700 flex-1">
              {category.name} ({category.count})
            </span>
          </label>
        ))}
      </div>
      {selectedCategories.length > 0 && (
        <div className="mt-4 p-2 bg-mint-50 rounded">
          <p className="text-sm text-mint-700 font-medium">
            Categorías seleccionadas: {selectedCategories.length}
          </p>
        </div>
      )}
    </div>
  );
};
