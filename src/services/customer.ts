import axiosInstance from '@/utils/axios';

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
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  role: string;
  avatar_url: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
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
  private static readonly BASE_URL = '/api/wp-json/wc/v1/customers';

  /**
   * Obtener datos del cliente actual
   */
  static async getCurrentCustomer(): Promise<CustomerResponse> {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/me`);
      return response.data;
    } catch (error) {
      console.error('Error getting current customer:', error);
      throw new Error('Error al obtener los datos del cliente');
    }
  }

  /**
   * Obtener datos de un cliente específico por ID
   */
  static async getCustomer(customerId: number): Promise<CustomerResponse> {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting customer:', error);
      throw new Error('Error al obtener los datos del cliente');
    }
  }

  /**
   * Actualizar datos del cliente
   */
  static async updateCustomer(customerId: number, data: CustomerData): Promise<CustomerResponse> {
    try {
      const response = await axiosInstance.put(`${this.BASE_URL}/${customerId}`, data);
      return response.data;
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
   * Actualizar parcialmente los datos del cliente
   */
  static async patchCustomer(customerId: number, data: Partial<CustomerData>): Promise<CustomerResponse> {
    try {
      const response = await axiosInstance.patch(`${this.BASE_URL}/${customerId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error patching customer:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error('Error al actualizar los datos del cliente');
    }
  }

  /**
   * Actualizar contraseña del cliente
   */
  static async updatePassword(customerId: number, newPassword: string): Promise<CustomerResponse> {
    try {
      const response = await axiosInstance.patch(`${this.BASE_URL}/${customerId}`, {
        password: newPassword
      });
      return response.data;
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
