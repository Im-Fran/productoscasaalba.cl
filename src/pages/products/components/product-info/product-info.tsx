import { useState } from 'react';
import type {Product} from "@/types/product";
import {ProductPrice} from "@/pages/products/components/product-info/product-price.tsx";
import {ProductRating} from "@/pages/products/components/product-info/product-rating.tsx";
import { ProductVariationSelector } from "@/pages/products/components/product-variation-selector.tsx";
import { useProductVariations } from "@/pages/products/hooks/useProductVariations";
import toast from "react-hot-toast";
import {useCart} from "@/hooks/useCart";

export type ProductInfoProps = {
  product: Product
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const cart = useCart()
  const [quantity, setQuantity] = useState(1);

  // Hook para manejar variaciones
  const {
    selectedVariation,
    variationData,
    loadingVariation,
    variationError,
    availableAttributes,
    isSelectionComplete,
    hasVariations,
    selectedVariationId,
    updateSelection,
    clearSelection,
    getCurrentProduct,
  } = useProductVariations(product);

  // Usar el producto actual (variación o producto base)
  const currentProduct = getCurrentProduct();

  // Determinar si se puede agregar al carrito
  const canAddToCart = hasVariations ? isSelectionComplete && !loadingVariation && currentProduct.is_in_stock : currentProduct.is_in_stock;

  // Obtener texto del botón
  const getButtonText = () => {
    if (loadingVariation) return 'Cargando...';
    if (hasVariations && !isSelectionComplete) return 'Selecciona las opciones';
    if (!currentProduct.is_in_stock) return 'Sin stock';
    return currentProduct.add_to_cart?.text || 'Agregar al carrito';
  };

  const addToCart = async () => {
    if(!canAddToCart) {
      return;
    }

    const productId = hasVariations ? selectedVariationId : product.id

    if(productId === null) {
      toast.error('No hay una variación seleccionada para agregar al carrito.');
      return;
    }


    await toast.promise(cart.addToCart(productId, quantity), {
      loading: 'Agregando al carrito...',
      success: 'Producto agregado al carrito.',
      error: (err) => err.message || 'Error al agregar el producto al carrito.'
    })
  }

  const removeQtyFromCart = () => setQuantity(Math.max(currentProduct.add_to_cart?.minimum || 1, quantity - 1))
  const addQtyToCart = () => {
    const maxQuantity = currentProduct.add_to_cart?.maximum || 9999;
    setQuantity(Math.min(maxQuantity, quantity + 1));
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        {/* Variation info */}
        {variationData && <p className="text-sm text-gray-600 mb-2">
          {variationData.variation}
        </p>}

        {/* Rating */}
        <ProductRating product={product}/>
      </div>

      {/* Price */}
      <ProductPrice product={currentProduct}/>

      {/* Short description */}
      {product.short_description && <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.short_description }}/>}

      {/* Product Variations */}
      <ProductVariationSelector
        availableAttributes={availableAttributes}
        selectedVariation={selectedVariation}
        onUpdateSelection={updateSelection}
        loadingVariation={loadingVariation}
        hasVariations={hasVariations || false}
      />

      {/* Variation Error */}
      {variationError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{variationError}</p>
      </div>}

      {/* Stock Status */}
      {currentProduct.stock_availability && (
        <div className="text-sm">
          <span className={`font-medium ${currentProduct.stock_availability.class === 'in-stock' ? 'text-green-600' : 'text-red-600'}`}>
            {currentProduct.stock_availability.text ||
             (currentProduct.is_in_stock ? 'En stock' : 'Sin stock')}
          </span>
        </div>
      )}

      {/* SKU */}
      {currentProduct.sku && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">SKU:</span> {currentProduct.sku}
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Cantidad:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={removeQtyFromCart}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={!canAddToCart}
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={addQtyToCart}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={!canAddToCart}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`
            w-full py-3 px-6 rounded-lg font-medium text-white transition-colors
            ${canAddToCart
              ? 'bg-mint-600 hover:bg-mint-700 focus:ring-2 focus:ring-mint-500 focus:ring-offset-2'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
          disabled={!canAddToCart}
          onClick={addToCart}
        >
          {getButtonText()}
        </button>

        {/* Clear Selection Button */}
        {hasVariations && Object.keys(selectedVariation).length > 0 && <button onClick={clearSelection} className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-mint-500 focus:ring-offset-2">Limpiar selección</button>}

        {/* Quantity limits info */}
        {(currentProduct.add_to_cart?.minimum || 0) > 1 && <p className="text-xs text-gray-500">Cantidad mínima: {currentProduct.add_to_cart?.minimum}</p>}
      </div>
    </div>
  );
};
