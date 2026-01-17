export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Última actualización: {new Date().toLocaleDateString('es-CL')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <p>
                Bienvenido a Productos Casa Alba. Al acceder y utilizar este sitio web, usted acepta 
                cumplir con estos términos y condiciones de uso. Si no está de acuerdo con alguna 
                parte de estos términos, por favor no utilice nuestro sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Uso del Sitio</h2>
              <p className="mb-3">
                Este sitio web es una plataforma de comercio electrónico operada en Chile. 
                El uso de este sitio está destinado para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navegación y búsqueda de productos de limpieza</li>
                <li>Realización de compras de productos disponibles</li>
                <li>Acceso a información de la empresa y sus servicios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Productos y Precios</h2>
              <p className="mb-3">
                Nos esforzamos por proporcionar información precisa sobre nuestros productos. Sin embargo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Los precios están expresados en pesos chilenos (CLP) e incluyen IVA cuando corresponda</li>
                <li>Nos reservamos el derecho de modificar precios sin previo aviso</li>
                <li>Las imágenes de productos son ilustrativas y pueden variar del producto real</li>
                <li>La disponibilidad de productos está sujeta a stock</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pedidos y Pagos</h2>
              <p className="mb-3">
                Al realizar un pedido en nuestro sitio:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usted confirma que toda la información proporcionada es verdadera y precisa</li>
                <li>Nos reservamos el derecho de rechazar o cancelar cualquier pedido</li>
                <li>La confirmación del pedido se enviará por correo electrónico</li>
                <li>El pago debe realizarse según los métodos de pago disponibles en el sitio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Entrega</h2>
              <p className="mb-3">
                Los plazos de entrega son estimados y pueden variar según:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La ubicación de entrega dentro de Chile</li>
                <li>Disponibilidad de stock</li>
                <li>Condiciones climáticas o situaciones de fuerza mayor</li>
              </ul>
              <p className="mt-3">
                No nos hacemos responsables por retrasos causados por terceros o situaciones fuera de nuestro control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Devoluciones y Cambios</h2>
              <p className="mb-3">
                Las políticas de devolución y cambio se rigen por la Ley del Consumidor de Chile (Ley N° 19.496):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tiene derecho a retracto dentro de 10 días corridos desde la recepción del producto</li>
                <li>Los productos deben estar sin usar y en su embalaje original</li>
                <li>Los gastos de devolución corren por cuenta del cliente, salvo que el producto presente fallas</li>
                <li>El reembolso se realizará dentro de los plazos legales establecidos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de este sitio web, incluyendo pero no limitado a textos, gráficos, 
                logotipos, imágenes y software, es propiedad de Productos Casa Alba o sus proveedores 
                de contenido y está protegido por las leyes de propiedad intelectual de Chile.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitación de Responsabilidad</h2>
              <p className="mb-3">
                Productos Casa Alba no será responsable por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daños indirectos o consecuentes derivados del uso de nuestros productos</li>
                <li>Interrupciones del servicio del sitio web</li>
                <li>Errores u omisiones en el contenido del sitio</li>
                <li>Uso inadecuado de los productos adquiridos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Jurisdicción y Ley Aplicable</h2>
              <p className="mb-3">
                <strong>Estos términos y condiciones se rigen por las leyes de la República de Chile.</strong>
              </p>
              <p className="mb-3">
                Cualquier disputa, controversia o reclamo que surja de o en relación con estos términos 
                y condiciones, o el incumplimiento, terminación o invalidez de los mismos, deberá ser 
                presentado ante los tribunales competentes de Chile.
              </p>
              <p className="font-semibold">
                Los gastos legales derivados de cualquier acción legal iniciada por el cliente serán 
                de su exclusiva responsabilidad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web. 
                Es su responsabilidad revisar periódicamente estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contacto</h2>
              <p className="mb-3">
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> contacto@productoscasaalba.cl</li>
                <li><strong>Teléfono:</strong> +56 9 4271 7395</li>
                <li><strong>WhatsApp:</strong> +56 9 4271 7395</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
