import {type FC, type FormEvent, useState} from "react";

interface CouponFormProps {
  onApply: (code: string) => void;
  loading: boolean;
}

export const CouponForm: FC<CouponFormProps> = ({ onApply, loading }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      onApply(couponCode.trim());
      setCouponCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Ingrese código de cupón"
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !couponCode.trim()}
          className="w-full sm:w-auto bg-mint-600 hover:bg-mint-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Aplicando...' : 'Aplicar'}
        </button>
      </div>
    </form>
  );
};