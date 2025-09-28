import { useState, useEffect } from 'react';
import { CustomerService, type CustomerResponse } from '@/services/customer';
import { useAuth } from '@/hooks/useAuth';

export const useCustomer = () => {
  const { user, isAuthenticated } = useAuth();
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!isAuthenticated || !user) {
        setCustomer(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const customerData = await CustomerService.getCustomer(user.id);
        setCustomer(customerData);
      } catch (err) {
        console.error('Error loading customer data:', err);
        setError('Error al cargar los datos del cliente');
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [user, isAuthenticated]);

  return {
    customer,
    loading,
    error,
    isAuthenticated,
  };
};
