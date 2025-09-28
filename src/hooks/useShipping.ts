import { useState, useEffect } from 'react';
import { ShippingService, type ShippingOption } from '@/services/shipping';

export const useShipping = () => {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);

  const loadShippingOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const options = await ShippingService.getShippingOptions();
      setShippingOptions(options);

      // Establecer la opción seleccionada por defecto
      const selectedOption = options.find(option => option.selected);
      if (selectedOption) {
        setSelectedShippingId(selectedOption.id);
      }
    } catch (err) {
      console.error('Error loading shipping options:', err);
      setError('Error al cargar las opciones de envío');
    } finally {
      setLoading(false);
    }
  };

  const selectShippingOption = async (rateId: string, packageId: number = 0) => {
    try {
      setLoading(true);
      const success = await ShippingService.selectShippingRate(rateId, packageId);

      if (success) {
        setSelectedShippingId(rateId);
        // Recargar las opciones para obtener los totales actualizados
        await loadShippingOptions();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error selecting shipping option:', err);
      setError('Error al seleccionar la opción de envío');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShippingOptions();
  }, []);

  return {
    shippingOptions,
    loading,
    error,
    selectedShippingId,
    selectShippingOption,
    refreshShippingOptions: loadShippingOptions,
  };
};
