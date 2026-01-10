interface OrdersErrorProps {
  error: string;
}

export default function OrdersError({ error }: OrdersErrorProps) {
  return (
    <div className="p-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar pedidos</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-mint-600 text-white px-6 py-2 rounded hover:bg-mint-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

