import axiosInstance from '../utils/axios';

export interface ContactFormData {
  'your-name': string;
  'your-email': string;
  'your-subject': string;
  'your-message': string;
  '_wpcf7_turnstile_response': string
}

export interface ContactFormResponse {
  status: 'spam' | 'invalid' | 'validation_failed' | 'accept' | 'mail_sent' | 'mail_failed';
  message: string;
  posted_data_hash?: string;
  into?: string;
  invalid_fields?: Array<{
    field: string;
    message: string;
    idref?: string;
  }>;
}

export interface ContactFormInfo {
  id: number;
  hash: string;
  slug: string;
  title: string;
  locale: string;
}

const CONTACT_FORM_HASH = '73d13a3';

// Cache para el ID del formulario
let cachedFormId: number | null = null;

const getContactFormId = async (): Promise<number> => {
  // Si ya tenemos el ID en cache, usarlo
  if (cachedFormId) {
    return cachedFormId;
  }

  try {
    const response = await axiosInstance.get<ContactFormInfo[]>(
      '/api/wp-json/contact-form-7/v1/contact-forms'
    );

    const contactForms = response.data;
    const targetForm = contactForms.find(form => form.hash === CONTACT_FORM_HASH);

    if (!targetForm) {
      throw new Error(`No se encontró el formulario con hash: ${CONTACT_FORM_HASH}`);
    }

    // Guardar en cache para futuras llamadas
    cachedFormId = targetForm.id;
    return targetForm.id;
  } catch (error: unknown) {
    console.error('Error al obtener el ID del formulario de contacto:', error);
    throw new Error('No se pudo obtener la información del formulario de contacto.');
  }
};

export const submitContactForm = async (formData: ContactFormData): Promise<ContactFormResponse> => {
  try {
    // Primero obtener el ID del formulario
    const formId = await getContactFormId();

    // Crear FormData para enviar como multipart/form-data
    const submitData = new FormData();

    // Añadir los campos del formulario
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    // Añadir el campo requerido _wpcf7_unit_tag
    submitData.append('_wpcf7_unit_tag', `wpcf7-f${formId}`);

    const response = await axiosInstance.post(
      `/api/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
      submitData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error('Error al enviar formulario de contacto:', error);

    // Si hay una respuesta del servidor, usar esa información
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ContactFormResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    // Error genérico
    throw new Error('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
  }
};
