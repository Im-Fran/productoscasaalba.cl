export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Última actualización: {new Date().toLocaleDateString('es-CL')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introducción</h2>
              <p>
                En Productos Casa Alba, valoramos y respetamos su privacidad. Esta Política de Privacidad 
                describe cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando 
                utiliza nuestro sitio web de comercio electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Información que Recopilamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">2.1 Información que Usted Proporciona</h3>
              <p className="mb-3">Recopilamos información que usted nos proporciona directamente, incluyendo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de entrega y facturación</li>
                <li>Información de pago (procesada de forma segura por terceros)</li>
                <li>Historial de compras</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">2.2 Información Recopilada Automáticamente</h3>
              <p className="mb-3">
                Cuando visita nuestro sitio web, recopilamos automáticamente cierta información sobre su 
                dispositivo y su actividad de navegación, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección IP</li>
                <li>Tipo de navegador y versión</li>
                <li>Sistema operativo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Productos vistos, buscados y clickeados</li>
                <li>Términos de búsqueda utilizados</li>
                <li>Productos agregados al carrito de compras</li>
                <li>Información de cookies y tecnologías similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Uso de Cookies y Tecnologías de Seguimiento</h2>
              <p className="mb-3">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia de navegación y 
                personalizar nuestros servicios. Las cookies nos permiten:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Recordar sus preferencias y configuraciones</li>
                <li>Mantener su sesión activa</li>
                <li>Analizar el tráfico del sitio web</li>
                <li>Personalizar el contenido y los anuncios</li>
                <li>Medir la efectividad de nuestras campañas de marketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartir Información con Terceros</h2>
              <p className="mb-3">
                Para mejorar nuestros servicios y ofrecer una mejor experiencia de compra, compartimos 
                su información con proveedores de servicios de confianza:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.1 Google Analytics</h3>
              <p className="mb-3">
                Utilizamos Google Analytics para analizar el uso de nuestro sitio web. Google Analytics 
                recopila información sobre cómo los usuarios interactúan con nuestro sitio, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Páginas visitadas</li>
                <li>Tiempo de permanencia</li>
                <li>Flujo de navegación</li>
                <li>Datos demográficos generales</li>
                <li>Intereses del usuario</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.2 Google Ads y Remarketing</h3>
              <p className="mb-3">
                Utilizamos Google Ads para mostrar anuncios relevantes basados en su comportamiento 
                de navegación. Esto incluye:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Productos que ha visto en nuestro sitio</li>
                <li>Productos que ha buscado</li>
                <li>Productos en su carrito de compras</li>
                <li>Categorías de productos de interés</li>
              </ul>
              <p className="mt-3">
                Esta información se utiliza para mostrarle anuncios personalizados cuando navega por 
                otros sitios web que forman parte de la red de Google.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.3 Otros Proveedores de Servicios</h3>
              <p className="mb-3">También podemos compartir su información con:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesadores de pago para procesar transacciones</li>
                <li>Servicios de entrega para enviar sus pedidos</li>
                <li>Proveedores de email marketing para enviar comunicaciones</li>
                <li>Servicios de atención al cliente</li>
                <li>Herramientas de análisis y optimización del sitio web</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cómo Usamos su Información</h2>
              <p className="mb-3">Utilizamos la información recopilada para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesar y gestionar sus pedidos</li>
                <li>Proporcionar servicio al cliente y soporte técnico</li>
                <li>Personalizar su experiencia de compra</li>
                <li>Enviar confirmaciones de pedidos y actualizaciones de entrega</li>
                <li>Comunicar ofertas especiales y promociones (si ha dado su consentimiento)</li>
                <li>Mejorar nuestro sitio web y servicios</li>
                <li>Analizar tendencias y comportamiento de usuarios</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seguridad de la Información</h2>
              <p className="mb-3">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información 
                personal contra acceso no autorizado, pérdida, alteración o divulgación:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encriptación SSL/TLS para transmisión de datos</li>
                <li>Almacenamiento seguro de datos</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de sistemas de seguridad</li>
                <li>Cumplimiento de estándares de seguridad de la industria</li>
              </ul>
              <p className="mt-3">
                Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 
                100% seguro, por lo que no podemos garantizar la seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Sus Derechos</h2>
              <p className="mb-3">
                De acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile, 
                usted tiene los siguientes derechos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Derecho de acceso:</strong> Solicitar información sobre los datos personales que tenemos sobre usted</li>
                <li><strong>Derecho de rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Derecho de cancelación:</strong> Solicitar la eliminación de sus datos personales</li>
                <li><strong>Derecho de oposición:</strong> Oponerse al procesamiento de sus datos para fines específicos</li>
                <li><strong>Derecho a retirar el consentimiento:</strong> Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos, puede contactarnos a través de los medios indicados al final 
                de esta política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Retención de Datos</h2>
              <p>
                Conservamos su información personal durante el tiempo necesario para cumplir con los 
                propósitos descritos en esta política, a menos que la ley requiera o permita un período 
                de retención más largo. Los datos de transacciones se mantienen según lo exige la 
                legislación tributaria chilena.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Menores de Edad</h2>
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos 
                intencionalmente información personal de menores de edad. Si tiene conocimiento de que 
                un menor ha proporcionado información personal, por favor contáctenos para que podamos 
                eliminar dicha información.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Enlaces a Sitios de Terceros</h2>
              <p>
                Nuestro sitio web puede contener enlaces a sitios de terceros. No somos responsables 
                de las prácticas de privacidad de estos sitios. Le recomendamos leer las políticas de 
                privacidad de cada sitio que visite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modificaciones a esta Política</h2>
              <p>
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. 
                Los cambios se publicarán en esta página con la fecha de "Última actualización" modificada. 
                Le recomendamos revisar periódicamente esta política para mantenerse informado sobre cómo 
                protegemos su información.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Jurisdicción</h2>
              <p>
                <strong>Esta Política de Privacidad se rige por las leyes de la República de Chile.</strong> 
                Cualquier disputa relacionada con esta política deberá ser presentada ante los tribunales 
                competentes de Chile.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contacto</h2>
              <p className="mb-3">
                Si tiene preguntas, inquietudes o desea ejercer sus derechos relacionados con su 
                información personal, puede contactarnos a través de:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> contacto@productoscasaalba.cl</li>
                <li><strong>Teléfono:</strong> +56 9 4271 7395</li>
                <li><strong>WhatsApp:</strong> +56 9 4271 7395</li>
              </ul>
            </section>

            <section className="mt-8 p-4 bg-mint-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Consentimiento</h2>
              <p>
                Al utilizar nuestro sitio web, usted acepta esta Política de Privacidad y consiente la 
                recopilación, uso y divulgación de su información personal según lo descrito en este documento.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
