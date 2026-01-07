import axiosInstance from '@/utils/axios';

export interface CustomerAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface CustomerProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone: string;
  date_created: string;
  orders_count: number;
  total_spent: number;
}

export interface CustomerAddresses {
  billing: CustomerAddress;
  shipping: CustomerAddress;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
}

export interface UpdateAddressesData {
  billing?: Partial<CustomerAddress>;
  shipping?: Partial<CustomerAddress>;
}

// Legacy interfaces for backward compatibility
export interface CustomerData {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export interface CustomerResponse extends CustomerData {
  id: number;
  date_created: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  role?: string;
  avatar_url?: string;
  meta_data?: Array<{
    id: number;
    key: string;
    value: string;
  }>;
  display_name?: string;
  phone?: string;
  orders_count?: number;
  total_spent?: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export class CustomerService {
  private static readonly BASE_URL = '/api/wp-json/casa-alba/v1/customer';

  /**
   * Obtener perfil del cliente autenticado
   */
  static async getProfile(): Promise<CustomerProfile> {
    try {
      const response = await axiosInstance.get<CustomerProfile>(`${this.BASE_URL}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error getting customer profile:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener el perfil del cliente');
    }
  }

  /**
   * Actualizar perfil del cliente autenticado
   */
  static async updateProfile(data: UpdateProfileData): Promise<CustomerProfile> {
    try {
      const response = await axiosInstance.put<{ message: string; profile: CustomerProfile }>(
        `${this.BASE_URL}/profile`,
        data
      );
      return response.data.profile;
    } catch (error) {
      console.error('Error updating customer profile:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al actualizar el perfil');
    }
  }

  /**
   * Obtener direcciones del cliente autenticado
   */
  static async getAddresses(): Promise<CustomerAddresses> {
    try {
      const response = await axiosInstance.get<CustomerAddresses>(`${this.BASE_URL}/addresses`);
      return response.data;
    } catch (error) {
      console.error('Error getting customer addresses:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al obtener las direcciones');
    }
  }

  /**
   * Actualizar direcciones del cliente autenticado
   */
  static async updateAddresses(data: UpdateAddressesData): Promise<CustomerAddresses> {
    try {
      const response = await axiosInstance.put<{ message: string; addresses: CustomerAddresses }>(
        `${this.BASE_URL}/addresses`,
        data
      );
      return response.data.addresses;
    } catch (error) {
      console.error('Error updating customer addresses:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Error al actualizar las direcciones');
    }
  }

  /**
   * Obtener datos del cliente actual (legacy - mantiene compatibilidad)
   */
  static async getCurrentCustomer(): Promise<CustomerResponse> {
    try {
      // Intentar usar el nuevo endpoint primero
      const profile = await this.getProfile();
      const addresses = await this.getAddresses();

      // Convertir al formato legacy
      return {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        display_name: profile.display_name,
        phone: profile.phone,
        date_created: profile.date_created,
        orders_count: profile.orders_count,
        total_spent: profile.total_spent,
        billing: addresses.billing,
        shipping: addresses.shipping,
      };
    } catch (error) {
      console.error('Error getting current customer:', error);
      throw new Error('Error al obtener los datos del cliente');
    }
  }

  /**
   * Obtener datos de un cliente específico por ID (legacy - usa el nuevo endpoint)
   */
  static async getCustomer(_customerId: number): Promise<CustomerResponse> {
    try {
      // El nuevo endpoint no requiere ID, usa el usuario autenticado
      return await this.getCurrentCustomer();
    } catch (error) {
      console.error('Error getting customer:', error);
      throw new Error('Error al obtener los datos del cliente');
    }
  }

  /**
   * Actualizar datos del cliente (legacy - usa los nuevos endpoints)
   */
  static async updateCustomer(_customerId: number, data: CustomerData): Promise<CustomerResponse> {
    try {
      // Separar datos de perfil y direcciones
      const profileData: UpdateProfileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      };

      const addressData: UpdateAddressesData = {
        billing: data.billing,
        shipping: data.shipping,
      };

      // Actualizar perfil si hay datos
      if (profileData.first_name || profileData.last_name || profileData.email) {
        await this.updateProfile(profileData);
      }

      // Actualizar direcciones si hay datos
      if (data.billing || data.shipping) {
        await this.updateAddresses(addressData);
      }

      // Retornar datos actualizados
      return await this.getCurrentCustomer();
    } catch (error) {
      console.error('Error updating customer:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error('Error al actualizar los datos del cliente');
    }
  }

  /**
   * Actualizar parcialmente los datos del cliente (legacy)
   */
  static async patchCustomer(customerId: number, data: Partial<CustomerData>): Promise<CustomerResponse> {
    return await this.updateCustomer(customerId, data as CustomerData);
  }

  /**
   * Actualizar contraseña del cliente
   */
  static async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axiosInstance.put(`${this.BASE_URL}/profile`, {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } catch (error) {
      console.error('Error updating password:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error('Error al actualizar la contraseña');
    }
  }
}

