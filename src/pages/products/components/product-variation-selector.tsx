import type { SelectedVariation } from '../hooks/useProductVariations';

export type ProductVariationSelectorProps = {
  availableAttributes: { [key: string]: string[] };
  selectedVariation: SelectedVariation;
  onUpdateSelection: (attributeName: string, value: string) => void;
  loadingVariation: boolean;
  hasVariations: boolean;
}

export const ProductVariationSelector = ({
  availableAttributes,
  selectedVariation,
  onUpdateSelection,
  loadingVariation,
  hasVariations
}: ProductVariationSelectorProps) => {
  if (!hasVariations) {
    return null;
  }

  const attributeNames = Object.keys(availableAttributes);

  if (attributeNames.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Opciones del producto</h3>

      {attributeNames.map(attributeName => (
        <div key={attributeName} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {attributeName}:
            {selectedVariation[attributeName] && (
              <span className="ml-2 text-mint-600 font-semibold">
                {selectedVariation[attributeName]}
              </span>
            )}
          </label>

          <div className="flex flex-wrap gap-2">
            {availableAttributes[attributeName].map(option => {
              const isSelected = selectedVariation[attributeName] === option;

              return (
                <button
                  key={option}
                  onClick={() => onUpdateSelection(attributeName, option)}
                  disabled={loadingVariation}
                  className={`
                    px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected
                      ? 'border-mint-600 bg-mint-600 text-white shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-mint-400 hover:bg-mint-50'
                    }
                    ${loadingVariation 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:shadow-sm'
                    }
                    focus:outline-none focus:ring-2 focus:ring-mint-500 focus:ring-offset-2
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {loadingVariation && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <div className="animate-spin w-4 h-4 border-2 border-mint-600 border-t-transparent rounded-full"></div>
          <span>Cargando información de la variación...</span>
        </div>
      )}
    </div>
  );
};
