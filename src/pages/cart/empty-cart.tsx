import {ShoppingBag} from "lucide-react";
import {useNavigate} from "react-router";

export const EmptyCart = () => {
  const navigate = useNavigate()

  const handleContinueShopping = () => {
    navigate('/productos')
  }

  return <div className="min-h-screen bg-neutral-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        {/* Empty cart icon */}
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>

        <h1 className="text-4xl font-bold text-mint-950 mb-4 pacifico-regular">
          Tu carrito está vacío
        </h1>
        <p className="text-lg text-gray-600 mb-8 font-handelson">
          Agrega algunos productos para comenzar tu compra
        </p>

        <button onClick={handleContinueShopping} className="bg-mint-950 hover:bg-mint-900 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Continuar comprando
        </button>
      </div>
    </div>
  </div>
}