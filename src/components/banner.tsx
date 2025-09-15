import { Link } from 'react-router';
import bidonesImg from '@/assets/images/bidones.webp';

export const Banner = () => (
  <Link to="/productos" className="block w-full">
    <div
      className="relative w-full h-24 md:h-32 flex items-center justify-center overflow-hidden rounded-md shadow-md mb-4">
      <img
        src={bidonesImg}
        alt="Banner Bidones"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80 blur-[1px]"
      />
      <div className="relative z-10 text-center">
          <span className="text-base md:text-2xl font-light text-mint-950 drop-shadow bg-mint-600/80 px-3 py-1 rounded">
            Nueva Tienda, Nueva Imagen, Misma Calidad
          </span>
      </div>
    </div>
  </Link>
);
