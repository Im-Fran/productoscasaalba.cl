import { useState, useEffect } from 'react';
import { CustomerService, type CustomerProfile, type CustomerAddresses } from '@/services/customer';
import type {User} from "@/types/user";

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
  const [profileData, setProfileData] = useState<CustomerProfile | null>(null);
  const [addressesData, setAddressesData] = useState<CustomerAddresses | null>(null);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    display_name: user.first_name + ' ' + user.last_name,
    email: user.email,
    phone: '',
  });
  const [addressFormData, setAddressFormData] = useState({
    billing: {
      first_name: user.first_name,
      last_name: user.last_name,
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
      first_name: user.first_name,
      last_name: user.last_name,
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
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar datos del cliente al montar el componente
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);

        // Cargar perfil y direcciones usando los nuevos endpoints
        const [profile, addresses] = await Promise.all([
          CustomerService.getProfile(),
          CustomerService.getAddresses()
        ]);

        setProfileData(profile);
        setAddressesData(addresses);

        // Actualizar formData con los datos del perfil
        setFormData({
          first_name: profile.first_name || user.first_name,
          last_name: profile.last_name || user.last_name,
          display_name: profile.display_name || user.first_name + ' ' + user.last_name,
          email: profile.email || user.email,
          phone: profile.phone || '',
        });

        // Actualizar addressFormData con las direcciones
        setAddressFormData({
          billing: {
            first_name: addresses.billing.first_name || user.first_name,
            last_name: addresses.billing.last_name || user.last_name,
            email: addresses.billing.email || user.email,
            company: addresses.billing.company || '',
            address_1: addresses.billing.address_1 || '',
            address_2: addresses.billing.address_2 || '',
            city: addresses.billing.city || '',
            state: addresses.billing.state || '',
            postcode: addresses.billing.postcode || '',
            country: addresses.billing.country || 'CL',
            phone: addresses.billing.phone || '',
          },
          shipping: {
            first_name: addresses.shipping.first_name || user.first_name,
            last_name: addresses.shipping.last_name || user.last_name,
            company: addresses.shipping.company || '',
            address_1: addresses.shipping.address_1 || '',
            address_2: addresses.shipping.address_2 || '',
            city: addresses.shipping.city || '',
            state: addresses.shipping.state || '',
            postcode: addresses.shipping.postcode || '',
            country: addresses.shipping.country || 'CL',
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

      // Actualizar perfil
      const updatedProfile = await CustomerService.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        email: formData.email,
        phone: formData.phone,
      });

      // Actualizar direcciones
      const updatedAddresses = await CustomerService.updateAddresses(addressFormData);

      setProfileData(updatedProfile);
      setAddressesData(updatedAddresses);
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

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await CustomerService.updatePassword(passwordData.currentPassword, passwordData.newPassword);

      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

  if (loading && !profileData) {
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
                  onChange={(e) => {
                    const newFirstName = e.target.value;
                    setFormData({ ...formData, first_name: newFirstName });
                    setAddressFormData({
                      billing: { ...addressFormData.billing, first_name: newFirstName },
                      shipping: { ...addressFormData.shipping, first_name: newFirstName }
                    });
                  }}
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
                  onChange={(e) => {
                    const newLastName = e.target.value;
                    setFormData({ ...formData, last_name: newLastName });
                    setAddressFormData({
                      billing: { ...addressFormData.billing, last_name: newLastName },
                      shipping: { ...addressFormData.shipping, last_name: newLastName }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setFormData({ ...formData, email: newEmail });
                    setAddressFormData({
                      ...addressFormData,
                      billing: { ...addressFormData.billing, email: newEmail }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  placeholder="+56912345678"
                />
              </div>
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
                if (profileData && addressesData) {
                  setFormData({
                    first_name: profileData.first_name || user.first_name,
                    last_name: profileData.last_name || user.last_name,
                    display_name: profileData.display_name || user.first_name + ' ' + user.last_name,
                    email: profileData.email || user.email,
                    phone: profileData.phone || '',
                  });
                  setAddressFormData({
                    billing: {
                      ...addressesData.billing,
                      email: addressesData.billing.email || user.email,
                      phone: addressesData.billing.phone || '',
                    },
                    shipping: addressesData.shipping,
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
                <p className="text-lg text-gray-900">{profileData?.first_name || user.first_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Apellidos</label>
                <p className="text-lg text-gray-900">{profileData?.last_name || user.last_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
                <p className="text-lg text-gray-900">{profileData?.email || user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                <p className="text-lg text-gray-900">{profileData?.phone || 'No especificado'}</p>
              </div>
            </div>

            {profileData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Pedidos Totales</label>
                  <p className="text-lg text-gray-900">{profileData.orders_count}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Gastado</label>
                  <p className="text-lg text-gray-900">${profileData.total_spent.toLocaleString('es-CL')}</p>
                </div>
              </div>
            )}
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
                Contraseña Actual *
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                placeholder="Mínimo 8 caracteres"
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
                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="bg-mint-600 text-white px-6 py-2 rounded hover:bg-mint-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
