import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import { Home, ArrowLeft, Mail, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;
  let errorStatus: string | number = "Error";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || "Ha ocurrido un error inesperado";
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = "Ha ocurrido un error inesperado";
  }

  // Mensaje personalizado según el tipo de error
  const getCustomMessage = () => {
    if (errorStatus === 404) {
      return "La página que buscas no existe o ha sido movida.";
    }
    if (typeof errorStatus === 'number' && errorStatus >= 500) {
      return "Estamos experimentando problemas técnicos. Por favor, inténtalo más tarde.";
    }
    return errorMessage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white shadow-xl rounded-2xl px-8 py-12 border border-mint-200">
          <div className="text-center">
            {/* Error status con estilo Casa Alba */}
            <div className="mb-6">
              <h1 className="text-8xl md:text-9xl font-bold text-mint-300 mb-2 font-handelson">
                {errorStatus}
              </h1>
              <div className="w-20 h-1 bg-mint-600 mx-auto rounded-full"></div>
            </div>

            {/* Main heading con tipografía de la marca */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pacifico">
              ¡Ups! Algo salió mal
            </h2>

            {/* Error message */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {getCustomMessage()}
            </p>

            {/* Action buttons con colores Casa Alba */}
            <div className="space-y-4">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-mint-600 hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 transition-all duration-200 transform hover:scale-105"
              >
                <Home size={20} />
                Volver al inicio
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-mint-300 rounded-xl shadow-sm text-sm font-medium text-mint-700 bg-white hover:bg-mint-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 transition-all duration-200"
                >
                  <ArrowLeft size={18} />
                  Volver atrás
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-mint-300 rounded-xl shadow-sm text-sm font-medium text-mint-700 bg-white hover:bg-mint-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 transition-all duration-200"
                >
                  <RefreshCw size={18} />
                  Reintentar
                </button>
              </div>
            </div>

            {/* Additional help con estilo Casa Alba */}
            <div className="mt-8 pt-6 border-t border-mint-200">
              <p className="text-sm text-gray-500 mb-4">
                Si el problema persiste, no dudes en contactarnos
              </p>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 text-mint-600 hover:text-mint-700 font-medium transition-colors duration-200"
              >
                <Mail size={16} />
                Contactar soporte
              </Link>
            </div>

            {/* Branding sutil */}
            <div className="mt-6">
              <p className="text-xs text-gray-400 font-pacifico">
                Casa Alba
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
