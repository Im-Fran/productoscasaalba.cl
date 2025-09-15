import { useState, useEffect } from 'react';
import { CustomerService, type CustomerData, type CustomerResponse } from '@/services/customer';
import type { User } from '@/contexts/AuthContext';

interface ProfileSectionProps {
  user: User;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(null);
  const [formData, setFormData] = useState({
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    billing: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'CL',
      phone: '',
    },
    shipping: {
      first_name: user.firstName,
      last_name: user.lastName,
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'CL',
    }
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar datos del cliente al montar el componente
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        const customer = await CustomerService.getCustomer(user.id);
        setCustomerData(customer);

        // Actualizar formData con los datos del cliente
        setFormData({
          first_name: customer.first_name || user.firstName,
          last_name: customer.last_name || user.lastName,
          email: customer.email || user.email,
          billing: {
            first_name: customer.billing?.first_name || user.firstName,
            last_name: customer.billing?.last_name || user.lastName,
            email: customer.billing?.email || user.email,
            company: customer.billing?.company || '',
            address_1: customer.billing?.address_1 || '',
            address_2: customer.billing?.address_2 || '',
            city: customer.billing?.city || '',
            state: customer.billing?.state || '',
            postcode: customer.billing?.postcode || '',
            country: customer.billing?.country || 'CL',
            phone: customer.billing?.phone || '',
          },
          shipping: {
            first_name: customer.shipping?.first_name || user.firstName,
            last_name: customer.shipping?.last_name || user.lastName,
            company: customer.shipping?.company || '',
            address_1: customer.shipping?.address_1 || '',
            address_2: customer.shipping?.address_2 || '',
            city: customer.shipping?.city || '',
            state: customer.shipping?.state || '',
            postcode: customer.shipping?.postcode || '',
            country: customer.shipping?.country || 'CL',
          }
        });
      } catch (error) {
        console.error('Error loading customer data:', error);
        setMessage({ type: 'error', text: 'Error al cargar los datos del cliente' });
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const updateData: CustomerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        billing: formData.billing,
        shipping: formData.shipping,
      };

      const updatedCustomer = await CustomerService.updateCustomer(user.id, updateData);
      setCustomerData(updatedCustomer);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      console.error('Error saving profile:', error);
      const apiError = error as ApiError;
      setMessage({
        type: 'error',
        text: apiError.message || 'Error al guardar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await CustomerService.updatePassword(user.id, passwordData.newPassword);

      setIsChangingPassword(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error changing password:', error);
      const apiError = error as ApiError;
      setMessage({
        type: 'error',
        text: apiError.message || 'Error al cambiar la contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !customerData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Información del Perfil</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="bg-mint-600 text-white px-4 py-2 rounded hover:bg-mint-700 transition-colors disabled:opacity-50"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* Mensajes de estado */}
      {message && (
        <div className={`p-4 rounded-md mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-8">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    first_name: e.target.value,
                    billing: { ...formData.billing, first_name: e.target.value },
                    shipping: { ...formData.shipping, first_name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    last_name: e.target.value,
                    billing: { ...formData.billing, last_name: e.target.value },
                    shipping: { ...formData.shipping, last_name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({
                  ...formData,
                  email: e.target.value,
                  billing: { ...formData.billing, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-mint-600 text-white px-6 py-2 rounded hover:bg-mint-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setMessage(null);
                // Restaurar datos originales
                if (customerData) {
                  setFormData({
                    first_name: customerData.first_name || user.firstName,
                    last_name: customerData.last_name || user.lastName,
                    email: customerData.email || user.email,
                    billing: {
                      first_name: customerData.billing?.first_name || user.firstName,
                      last_name: customerData.billing?.last_name || user.lastName,
                      email: customerData.billing?.email || user.email,
                      company: customerData.billing?.company || '',
                      address_1: customerData.billing?.address_1 || '',
                      address_2: customerData.billing?.address_2 || '',
                      city: customerData.billing?.city || '',
                      state: customerData.billing?.state || '',
                      postcode: customerData.billing?.postcode || '',
                      country: customerData.billing?.country || 'CL',
                      phone: customerData.billing?.phone || '',
                    },
                    shipping: {
                      first_name: customerData.shipping?.first_name || user.firstName,
                      last_name: customerData.shipping?.last_name || user.lastName,
                      company: customerData.shipping?.company || '',
                      address_1: customerData.shipping?.address_1 || '',
                      address_2: customerData.shipping?.address_2 || '',
                      city: customerData.shipping?.city || '',
                      state: customerData.shipping?.state || '',
                      postcode: customerData.shipping?.postcode || '',
                      country: customerData.shipping?.country || 'CL',
                    }
                  });
                }
              }}
              disabled={loading}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Vista de solo lectura */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                <p className="text-lg text-gray-900">{customerData?.first_name || user.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Apellidos</label>
                <p className="text-lg text-gray-900">{customerData?.last_name || user.lastName}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
              <p className="text-lg text-gray-900">{customerData?.email || user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sección de cambio de contraseña */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Contraseña</h3>
          {!isChangingPassword && (
            <button
              onClick={() => {
                setIsChangingPassword(true);
                setMessage(null);
              }}
              disabled={loading}
              className="text-mint-600 hover:text-mint-700 font-medium disabled:opacity-50"
            >
              Cambiar Contraseña
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña *
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleChangePassword}
                disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                className="bg-mint-600 text-white px-6 py-2 rounded hover:bg-mint-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ newPassword: '', confirmPassword: '' });
                  setMessage(null);
                }}
                disabled={loading}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Tu contraseña está protegida. Haz clic en "Cambiar Contraseña" para actualizarla.
          </p>
        )}
      </div>
    </div>
  );
}
