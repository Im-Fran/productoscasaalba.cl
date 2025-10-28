import { useState, useEffect, useCallback } from 'react';
import { PaymentService, type PaymentMethod, type CheckoutOrderResponse } from '@/services/payment';

type ProcessOrderSuccess = {
  success: true;
  data: CheckoutOrderResponse;
};

type ProcessOrderError = {
  success: false;
  error: string;
};

type ProcessOrderResult = ProcessOrderSuccess | ProcessOrderError;

export const usePayment = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const loadPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { methods, selectedMethodId } = await PaymentService.getPaymentMethods();
      setPaymentMethods(methods);

      // Usar el método seleccionado desde el servidor si existe
      // Si no hay ninguno seleccionado, usar el primero como fallback
      if (selectedMethodId) {
        setSelectedPaymentMethod(selectedMethodId);
      } else if (methods.length > 0 && !selectedPaymentMethod) {
        setSelectedPaymentMethod(methods[0].id);
      }
    } catch (err) {
      console.error('Error loading payment methods:', err);
      setError('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  }, [selectedPaymentMethod]);

  const selectPaymentMethod = async (methodId: string) => {
    try {
      setSelectedPaymentMethod(methodId);
      // Guardar el método de pago en el checkout
      await PaymentService.selectPaymentMethod(methodId);
    } catch (error) {
      console.error('Error selecting payment method:', error);
    }
  };

  const processOrder = async (orderData: {
    billing_address: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
    shipping_address: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      phone: string;
    };
    payment_method: string;
    customer_note?: string;
  }): Promise<ProcessOrderResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await PaymentService.processOrder(orderData);
      return { success: true, data: result };
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || 'Error al procesar el pedido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  return {
    paymentMethods,
    loading,
    error,
    selectedPaymentMethod,
    selectPaymentMethod,
    processOrder,
    refreshPaymentMethods: loadPaymentMethods,
  };
};
