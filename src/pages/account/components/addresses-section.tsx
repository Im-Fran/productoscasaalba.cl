import { useState, useEffect } from 'react';
import { CustomerService, type CustomerResponse } from '@/services/customer';
import { useAuth } from '@/hooks/useAuth';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function AddressesSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(null);
  const [editingSection, setEditingSection] = useState<'billing' | 'shipping' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [billingForm, setBillingForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'CL',
    email: '',
    phone: '',
  });

  const [shippingForm, setShippingForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'CL',
  });

  // Cargar datos del cliente
  useEffect(() => {
    const loadCustomerData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const customer = await CustomerService.getCustomer(user.id);
        setCustomerData(customer);

        // Inicializar formularios con datos existentes
        if (customer.billing) {
          setBillingForm({
            first_name: customer.billing.first_name || user.firstName,
            last_name: customer.billing.last_name || user.lastName,
            company: customer.billing.company || '',
            address_1: customer.billing.address_1 || '',
            address_2: customer.billing.address_2 || '',
            city: customer.billing.city || '',
            state: customer.billing.state || '',
            postcode: customer.billing.postcode || '',
            country: customer.billing.country || 'CL',
            email: customer.billing.email || user.email,
            phone: customer.billing.phone || '',
          });
        }

        if (customer.shipping) {
          setShippingForm({
            first_name: customer.shipping.first_name || user.firstName,
            last_name: customer.shipping.last_name || user.lastName,
            company: customer.shipping.company || '',
            address_1: customer.shipping.address_1 || '',
            address_2: customer.shipping.address_2 || '',
            city: customer.shipping.city || '',
            state: customer.shipping.state || '',
            postcode: customer.shipping.postcode || '',
            country: customer.shipping.country || 'CL',
          });
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
        setMessage({ type: 'error', text: 'Error al cargar las direcciones' });
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [user]);

  const handleSaveAddress = async (type: 'billing' | 'shipping') => {
    if (!user) return;

    try {
      setLoading(true);
      setMessage(null);

      const updateData = type === 'billing'
        ? { billing: billingForm }
        : { shipping: shippingForm };

      const updatedCustomer = await CustomerService.patchCustomer(user.id, updateData);
      setCustomerData(updatedCustomer);
      setEditingSection(null);
      setMessage({
        type: 'success',
        text: `Dirección de ${type === 'billing' ? 'facturación' : 'envío'} actualizada correctamente`
      });
    } catch (error) {
      console.error('Error saving address:', error);
      const apiError = error as ApiError;
      setMessage({
        type: 'error',
        text: apiError.message || 'Error al guardar la dirección'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBillingToShipping = () => {
    setShippingForm({
      first_name: billingForm.first_name,
      last_name: billingForm.last_name,
      company: billingForm.company,
      address_1: billingForm.address_1,
      address_2: billingForm.address_2,
      city: billingForm.city,
      state: billingForm.state,
      postcode: billingForm.postcode,
      country: billingForm.country,
    });
  };

  if (loading && !customerData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Direcciones</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dirección de Facturación */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dirección de Facturación</h3>
            {editingSection !== 'billing' && (
              <button
                onClick={() => setEditingSection('billing')}
                disabled={loading}
                className="text-mint-600 hover:text-mint-700 font-medium disabled:opacity-50"
              >
                Editar
              </button>
            )}
          </div>

          {editingSection === 'billing' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={billingForm.first_name}
                    onChange={(e) => setBillingForm({ ...billingForm, first_name: e.target.value })}
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
                    value={billingForm.last_name}
                    onChange={(e) => setBillingForm({ ...billingForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={billingForm.company}
                  onChange={(e) => setBillingForm({ ...billingForm, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={billingForm.address_1}
                  onChange={(e) => setBillingForm({ ...billingForm, address_1: e.target.value })}
                  placeholder="Calle y número"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección 2
                </label>
                <input
                  type="text"
                  value={billingForm.address_2}
                  onChange={(e) => setBillingForm({ ...billingForm, address_2: e.target.value })}
                  placeholder="Departamento, oficina, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={billingForm.city}
                    onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Región *
                  </label>
                  <select
                    value={billingForm.state}
                    onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  >
                    <option value="">Elige una opción…</option>
                    <option value="CL-AI">Aysén del General Carlos Ibañez del Campo</option>
                    <option value="CL-AN">Antofagasta</option>
                    <option value="CL-AP">Arica y Parinacota</option>
                    <option value="CL-AR">La Araucanía</option>
                    <option value="CL-AT">Atacama</option>
                    <option value="CL-BI">Biobío</option>
                    <option value="CL-CO">Coquimbo</option>
                    <option value="CL-LI">Libertador General Bernardo O'Higgins</option>
                    <option value="CL-LL">Los Lagos</option>
                    <option value="CL-LR">Los Ríos</option>
                    <option value="CL-MA">Magallanes</option>
                    <option value="CL-ML">Maule</option>
                    <option value="CL-NB">Ñuble</option>
                    <option value="CL-RM">Región Metropolitana de Santiago</option>
                    <option value="CL-TA">Tarapacá</option>
                    <option value="CL-VS">Valparaíso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={billingForm.postcode}
                    onChange={(e) => setBillingForm({ ...billingForm, postcode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={billingForm.email}
                    onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
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
                    value={billingForm.phone}
                    onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => handleSaveAddress('billing')}
                  disabled={loading}
                  className="bg-mint-600 text-white px-4 py-2 rounded hover:bg-mint-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setMessage(null);
                    // Restaurar datos originales
                    if (customerData?.billing) {
                      setBillingForm({
                        first_name: customerData.billing.first_name || user?.firstName || '',
                        last_name: customerData.billing.last_name || user?.lastName || '',
                        company: customerData.billing.company || '',
                        address_1: customerData.billing.address_1 || '',
                        address_2: customerData.billing.address_2 || '',
                        city: customerData.billing.city || '',
                        state: customerData.billing.state || '',
                        postcode: customerData.billing.postcode || '',
                        country: customerData.billing.country || 'CL',
                        email: customerData.billing.email || user?.email || '',
                        phone: customerData.billing.phone || '',
                      });
                    }
                  }}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {customerData?.billing ? (
                <>
                  {customerData.billing.company && (
                    <p className="font-medium text-gray-900">{customerData.billing.company}</p>
                  )}
                  <p className="text-gray-700">
                    {customerData.billing.first_name} {customerData.billing.last_name}
                  </p>
                  {customerData.billing.address_1 && (
                    <p className="text-gray-700">{customerData.billing.address_1}</p>
                  )}
                  {customerData.billing.address_2 && (
                    <p className="text-gray-700">{customerData.billing.address_2}</p>
                  )}
                  <p className="text-gray-700">
                    {customerData.billing.city && `${customerData.billing.city}, `}
                    {customerData.billing.state && `${customerData.billing.state} `}
                    {customerData.billing.postcode}
                  </p>
                  {customerData.billing.phone && (
                    <p className="text-gray-700">Tel: {customerData.billing.phone}</p>
                  )}
                  <p className="text-gray-700">{customerData.billing.email}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">No hay dirección de facturación configurada</p>
              )}
            </div>
          )}
        </div>

        {/* Dirección de Envío */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dirección de Envío</h3>
            <div className="flex space-x-2">
              {editingSection === 'shipping' && (
                <button
                  onClick={handleCopyBillingToShipping}
                  className="text-sm text-mint-600 hover:text-mint-700 font-medium"
                >
                  Copiar facturación
                </button>
              )}
              {editingSection !== 'shipping' && (
                <button
                  onClick={() => setEditingSection('shipping')}
                  disabled={loading}
                  className="text-mint-600 hover:text-mint-700 font-medium disabled:opacity-50"
                >
                  Editar
                </button>
              )}
            </div>
          </div>

          {editingSection === 'shipping' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={shippingForm.first_name}
                    onChange={(e) => setShippingForm({ ...shippingForm, first_name: e.target.value })}
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
                    value={shippingForm.last_name}
                    onChange={(e) => setShippingForm({ ...shippingForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={shippingForm.company}
                  onChange={(e) => setShippingForm({ ...shippingForm, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={shippingForm.address_1}
                  onChange={(e) => setShippingForm({ ...shippingForm, address_1: e.target.value })}
                  placeholder="Calle y número"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección 2
                </label>
                <input
                  type="text"
                  value={shippingForm.address_2}
                  onChange={(e) => setShippingForm({ ...shippingForm, address_2: e.target.value })}
                  placeholder="Departamento, oficina, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Región *
                  </label>
                  <select
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  >
                    <option value="">Elige una opción…</option>
                    <option value="CL-AI">Aysén del General Carlos Ibañez del Campo</option>
                    <option value="CL-AN">Antofagasta</option>
                    <option value="CL-AP">Arica y Parinacota</option>
                    <option value="CL-AR">La Araucanía</option>
                    <option value="CL-AT">Atacama</option>
                    <option value="CL-BI">Biobío</option>
                    <option value="CL-CO">Coquimbo</option>
                    <option value="CL-LI">Libertador General Bernardo O'Higgins</option>
                    <option value="CL-LL">Los Lagos</option>
                    <option value="CL-LR">Los Ríos</option>
                    <option value="CL-MA">Magallanes</option>
                    <option value="CL-ML">Maule</option>
                    <option value="CL-NB">Ñuble</option>
                    <option value="CL-RM">Región Metropolitana de Santiago</option>
                    <option value="CL-TA">Tarapacá</option>
                    <option value="CL-VS">Valparaíso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={shippingForm.postcode}
                    onChange={(e) => setShippingForm({ ...shippingForm, postcode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => handleSaveAddress('shipping')}
                  disabled={loading}
                  className="bg-mint-600 text-white px-4 py-2 rounded hover:bg-mint-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setMessage(null);
                    // Restaurar datos originales
                    if (customerData?.shipping) {
                      setShippingForm({
                        first_name: customerData.shipping.first_name || user?.firstName || '',
                        last_name: customerData.shipping.last_name || user?.lastName || '',
                        company: customerData.shipping.company || '',
                        address_1: customerData.shipping.address_1 || '',
                        address_2: customerData.shipping.address_2 || '',
                        city: customerData.shipping.city || '',
                        state: customerData.shipping.state || '',
                        postcode: customerData.shipping.postcode || '',
                        country: customerData.shipping.country || 'CL',
                      });
                    }
                  }}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {customerData?.shipping ? (
                <>
                  {customerData.shipping.company && (
                    <p className="font-medium text-gray-900">{customerData.shipping.company}</p>
                  )}
                  <p className="text-gray-700">
                    {customerData.shipping.first_name} {customerData.shipping.last_name}
                  </p>
                  {customerData.shipping.address_1 && (
                    <p className="text-gray-700">{customerData.shipping.address_1}</p>
                  )}
                  {customerData.shipping.address_2 && (
                    <p className="text-gray-700">{customerData.shipping.address_2}</p>
                  )}
                  <p className="text-gray-700">
                    {customerData.shipping.city && `${customerData.shipping.city}, `}
                    {customerData.shipping.state && `${customerData.shipping.state} `}
                    {customerData.shipping.postcode}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">No hay dirección de envío configurada</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
