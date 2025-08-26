import {useState, useEffect, type FormEvent, type ChangeEvent} from 'react';

export type SearchBoxProps = {
  onSearch: (query: string) => void;
}

export const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Búsqueda automática con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation()
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar productos..."
            className="w-full px-4 py-3 pl-12 pr-20 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-16 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-mint-600 rounded-r-lg hover:bg-mint-700 focus:ring-2 focus:ring-mint-500"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600">
          Búsqueda automática activada para: "{searchQuery}"
        </div>
      )}
    </div>
  );
};
