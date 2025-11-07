import { useState } from 'react';

interface ProductTabsProps {
  description: string;
  attributes: Array<{
    id: number;
    name: string;
    taxonomy: string | null;
    has_variations: boolean;
    terms: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  }>;
  ratingCount: number;
  averageRating: string;
}

export const ProductTabs = ({ description, attributes, ratingCount, averageRating }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Descripción' },
    { id: 'additional', label: 'Información Adicional' },
    { id: 'reviews', label: `Valoraciones (${ratingCount})` },
  ];

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={`star-${i}`}
          className={`w-5 h-5 ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={`tab-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-mint-600 text-mint-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-gray-600">No hay descripción disponible para este producto.</p>
            )}
          </div>
        )}

        {activeTab === 'additional' && (
          <div>
            {attributes && attributes.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attributes.map((attribute) => (
                    <div key={`additional-attr-${attribute.id}`} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900 mb-2">
                        {attribute.name}
                      </div>
                      <div className="text-gray-700">
                        {attribute.terms && Array.isArray(attribute.terms) && attribute.terms.length > 0
                          ? attribute.terms.map(term => term.name).join(', ')
                          : 'No especificado'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No hay información adicional disponible para este producto.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {ratingCount > 0 ? (
              <>
                {/* Rating summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {parseFloat(averageRating).toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        {renderStars(averageRating)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {ratingCount} valoracion{ratingCount !== 1 ? 'es' : ''}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">{[5, 4, 3, 2, 1].map((stars) => (
                        <div key={`stars-rating-${stars}`} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-8">{stars}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Write review button */}
                <div className="text-center">
                  <button className="bg-mint-600 text-white px-6 py-3 rounded-lg hover:bg-mint-700 transition-colors font-medium">
                    Escribir una Valoración
                  </button>
                </div>

                {/* Reviews list (placeholder) */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Valoraciones de Clientes</h4>
                  <div className="text-gray-600">
                    Las valoraciones se cargarán desde la API de WordPress.
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Este producto aún no tiene valoraciones
                </p>
                <button className="bg-mint-600 text-white px-6 py-3 rounded-lg hover:bg-mint-700 transition-colors font-medium">
                  Sé el Primero en Valorar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
