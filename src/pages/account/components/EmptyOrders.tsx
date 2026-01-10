export default function EmptyOrders() {
  return (
    <div className="p-6 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Pedidos</h2>
          <p className="text-gray-600 mb-6">
            Aún no has realizado ningún pedido. ¡Descubre nuestros productos y haz tu primera compra!
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/productos"
            className="block w-full bg-mint-600 text-white px-6 py-3 rounded-lg hover:bg-mint-700 transition-colors font-medium"
          >
            Explorar Productos
          </a>
        </div>
      </div>
    </div>
  );
}

