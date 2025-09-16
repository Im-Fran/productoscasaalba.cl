import { useState, useCallback, useMemo } from 'react';
import axios from '@/utils/axios';
import type { Product, Variation } from '@/types/product';

export type SelectedVariation = {
  [attributeName: string]: string;
};

export const useProductVariations = (product: Product) => {
  const [selectedVariation, setSelectedVariation] = useState<SelectedVariation>({});
  const [variationData, setVariationData] = useState<Product | null>(null);
  const [loadingVariation, setLoadingVariation] = useState(false);
  const [variationError, setVariationError] = useState<string | null>(null);

  // Obtener los atributos disponibles directamente desde las variaciones
  const availableAttributes = useMemo(() => {
    const variationAttributes: { [key: string]: string[] } = {};

    // Verificar si el producto tiene variaciones antes de procesarlas
    if (!product.variations || !Array.isArray(product.variations) || product.variations.length === 0) {
      return variationAttributes;
    }

    // Extraer atributos únicos de todas las variaciones disponibles
    product.variations.forEach(variation => {
      if (variation.attributes && Array.isArray(variation.attributes)) {
        variation.attributes.forEach(attr => {
          if (attr.name && attr.value) {
            if (!variationAttributes[attr.name]) {
              variationAttributes[attr.name] = [];
            }
            if (!variationAttributes[attr.name].includes(attr.value)) {
              variationAttributes[attr.name].push(attr.value);
            }
          }
        });
      }
    });

    return variationAttributes;
  }, [product.variations]);

  // Verificar si todas las opciones requeridas están seleccionadas
  const isSelectionComplete = useMemo(() => {
    const requiredAttributes = Object.keys(availableAttributes);
    // Si no hay atributos requeridos, la selección está "completa"
    if (requiredAttributes.length === 0) return true;
    return requiredAttributes.every(attrName => selectedVariation[attrName]);
  }, [selectedVariation, availableAttributes]);

  // Encontrar la variación que coincide con la selección actual
  const findMatchingVariation = useCallback((selection: SelectedVariation): Variation | null => {
    if (!product.variations || !Array.isArray(product.variations) || product.variations.length === 0) {
      return null;
    }

    return product.variations.find(variation => {
      if (!variation.attributes || !Array.isArray(variation.attributes)) {
        return false;
      }
      return variation.attributes.every(attr =>
        selection[attr.name] === attr.value
      );
    }) || null;
  }, [product.variations]);

  // Obtener datos completos de la variación desde la API
  const fetchVariationData = useCallback(async (variationId: number) => {
    setLoadingVariation(true);
    setVariationError(null);

    try {
      const response = await axios.get(`/api/wp-json/wc/store/v1/products/${variationId}`);
      setVariationData(response.data);
    } catch (error) {
      console.error('Error fetching variation data:', error);
      setVariationError('Error al cargar los datos de la variación');
      setVariationData(null);
    } finally {
      setLoadingVariation(false);
    }
  }, []);

  // Actualizar selección de atributo
  const updateSelection = useCallback((attributeName: string, value: string) => {
    const newSelection = { ...selectedVariation, [attributeName]: value };
    setSelectedVariation(newSelection);

    // Limpiar datos de variación anterior
    setVariationData(null);
    setVariationError(null);

    // Si la selección está completa, buscar y cargar la variación
    const requiredAttributes = Object.keys(availableAttributes);
    const isComplete = requiredAttributes.every(attrName => newSelection[attrName]);

    if (isComplete && requiredAttributes.length > 0) {
      const matchingVariation = findMatchingVariation(newSelection);
      if (matchingVariation) {
        fetchVariationData(matchingVariation.id);
      } else {
        setVariationError('No se encontró una variación que coincida con la selección');
      }
    }
  }, [selectedVariation, availableAttributes, findMatchingVariation, fetchVariationData]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedVariation({});
    setVariationData(null);
    setVariationError(null);
  }, []);

  // Obtener el producto actual (variación si está seleccionada, sino el producto base)
  const getCurrentProduct = useCallback((): Product => {
    return variationData || product;
  }, [variationData, product]);

  // Verificar si el producto tiene variaciones disponibles
  const hasVariations = useMemo(() => {
    return product.type === 'variable' &&
           product.has_options &&
           product.variations &&
           Array.isArray(product.variations) &&
           product.variations.length > 0 &&
           Object.keys(availableAttributes).length > 0;
  }, [product.type, product.has_options, product.variations, availableAttributes]);

  // Obtener variación seleccionada actualmente
  const selectedVariationId = useMemo(() => {
    if (!isSelectionComplete) return null;
    const matchingVariation = findMatchingVariation(selectedVariation);
    return matchingVariation?.id || null;
  }, [isSelectionComplete, selectedVariation, findMatchingVariation]);

  return {
    // Estado
    selectedVariation,
    variationData,
    loadingVariation,
    variationError,

    // Datos computados
    availableAttributes,
    isSelectionComplete,
    hasVariations,
    selectedVariationId,

    // Acciones
    updateSelection,
    clearSelection,
    getCurrentProduct,
  };
};
