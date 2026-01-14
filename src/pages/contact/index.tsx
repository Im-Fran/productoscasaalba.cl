import { useState } from 'react';
import { submitContactForm, type ContactFormData, type ContactFormResponse } from '@/services/contact-form.ts';
import {Turnstile} from "@marsidev/react-turnstile";
import { FloatingProductsAnimation } from '@/components/FloatingProductsAnimation';

interface ContactForm {
  'your-name': string;
  'your-email': string;
  'your-subject': string;
  'your-message': string;
  '_wpcf7_turnstile_response': string,
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    'your-name': '',
    'your-email': '',
    'your-subject': '',
    'your-message': '',
    '_wpcf7_turnstile_response': '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores de validación cuando el usuario empieza a escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTurnstile = (token: string) => setFormData((prev) => ({
    ...prev,
    '_wpcf7_turnstile_response': token
  }))

  const handleTurnstileExpiration = () => setFormData((prev) => ({
    ...prev,
    '_wpcf7_turnstile_response': '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setValidationErrors({});

    try {
      const response: ContactFormResponse = await submitContactForm(formData as ContactFormData);

      if (response.status === 'mail_sent') {
        setSubmitStatus('success');
        setSubmitMessage(response.message || '¡Mensaje enviado con éxito! Te responderemos pronto.');
        setFormData({
          'your-name': '',
          'your-email': '',
          'your-subject': '',
          'your-message': '',
          '_wpcf7_turnstile_response': ''
        });
      } else if (response.status === 'validation_failed' && response.invalid_fields) {
        setSubmitStatus('error');
        const errors: Record<string, string> = {};
        response.invalid_fields.forEach(field => {
          errors[field.field] = field.message;
        });
        setValidationErrors(errors);
        setSubmitMessage('Por favor, corrige los errores en el formulario.');
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      }
    } catch (error: unknown) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 relative">
      {/* Floating Products Animation - Desktop Only */}
      <FloatingProductsAnimation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contáctanos</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ayudarte.
            Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Formulario de contacto */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">¡Escríbenos!</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tu nombre *
                </label>
                <input
                  type="text"
                  id="your-name"
                  name="your-name"
                  value={formData['your-name']}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent ${
                    validationErrors['your-name'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre completo"
                />
                {validationErrors['your-name'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['your-name']}</p>
                )}
              </div>

              <div>
                <label htmlFor="your-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Tu correo electrónico *
                </label>
                <input
                  type="email"
                  id="your-email"
                  name="your-email"
                  value={formData['your-email']}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent ${
                    validationErrors['your-email'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
                {validationErrors['your-email'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['your-email']}</p>
                )}
              </div>

              <div>
                <label htmlFor="your-subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="your-subject"
                  name="your-subject"
                  value={formData['your-subject']}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent ${
                    validationErrors['your-subject'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="¿De qué se trata tu mensaje?"
                />
                {validationErrors['your-subject'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['your-subject']}</p>
                )}
              </div>

              <div>
                <label htmlFor="your-message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tu mensaje (opcional)
                </label>
                <textarea
                  id="your-message"
                  name="your-message"
                  rows={6}
                  value={formData['your-message']}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent ${
                    validationErrors['your-message'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Escribe tu mensaje aquí..."
                />
                {validationErrors['your-message'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['your-message']}</p>
                )}
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{submitMessage}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{submitMessage}</p>
                </div>
              )}

              <Turnstile
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                onSuccess={handleTurnstile}
                options={{ refreshExpired: 'auto', refreshTimeout: 'auto' }}
                onExpire={handleTurnstileExpiration}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-mint-600 text-mint-950 py-3 px-6 rounded-lg font-semibold hover:bg-mint-700 focus:ring-2 focus:ring-mint-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">¡Comunícate!</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Teléfono</h3>
                    <a href={"tel:56942717395"} className="text-gray-600 hover:text-mint-950">+56 9 4271 7395</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contacto@productoscasaalba.cl</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">¿Necesitas ayuda inmediata?</h2>
              <p className="text-gray-600 mb-6">
                Para consultas urgentes, puedes contactarnos directamente por WhatsApp, y haremos lo posible por responder rápidamente.
              </p>
              <div className="text-center">
                <a href={"https://www.whatsapp.com/catalog/56942717395/?app_absent=0"} target={"_blank"} className="inline-block bg-mint-950 text-mint-50 py-2 px-4 rounded-lg hover:bg-mint-900 transition-colors">
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
