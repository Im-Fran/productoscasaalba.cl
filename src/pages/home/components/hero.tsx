import { useNavigate } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {cdnEndpoint} from "@/utils/constants.ts";

export const Hero = () => <>
  <Slides/>
</>

export const Slides = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="h-[60vh] md:h-[80vh] lg:h-screen"
    >
      <SwiperSlide>
        <CallToActionComprar />
      </SwiperSlide>
      {/* Aquí puedes agregar más slides en el futuro */}
    </Swiper>
  )
}


/*
 * Llamado a 'Comprar Ahora', es un hero que contiene de fondo una imagen de 'We can clean it!' que incluye al lado derecho de la imagen (esta siendo un cover) un titulo 'Productos Casa Alba',
 * Descripción: Venta online de productos para el hogar, limpieza y aseo. Somos una marca propia con artículos de excelente calidad.
 * Botón (mint-950) con el texto 'Comprar Ahora' que redirige a la página de productos.
 */
export const CallToActionComprar = () => {
  const navigate = useNavigate()

  const handleComprarAhora = () => {
    navigate('/productos')
  }

  return (
    <div className="relative h-[60vh] md:h-[80vh] lg:h-screen w-full overflow-hidden">
      {/* Fondo con gradiente conico */}
      <div
        className="absolute inset-0 blur-[30px]"
        style={{ 
          background: 'conic-gradient(from 180deg, #b7f2bc, #c2f5c1, #bcf1bf, #b7f2bc)'
        }}
      />
      
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${cdnEndpoint}/images/we-can-clean-it.webp)`
        }}
      />

      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenido */}
      <div className="relative h-full flex items-center justify-center md:justify-end px-4">
        <div className="max-w-md md:max-w-xl mx-4 md:mx-8 lg:mx-16 text-center md:text-right">
          {/* Título */}
          <h1 className="text-3xl md:text-4xl lg:text-6xl text-mint-1450 mb-4 md:mb-6 pacifico-regular">
            Productos Casa Alba
          </h1>

          {/* Descripción */}
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-red-800 mb-6 md:mb-8 leading-relaxed font-handelson">
            Venta online de productos para el hogar, limpieza y aseo. Somos una marca propia con artículos de excelente calidad.
          </p>

          {/* Botón */}
          <button
            onClick={handleComprarAhora}
            className="bg-mint-1150 hover:bg-mint-900 text-mint-50 py-3 px-6 md:py-4 md:px-8 rounded-lg transition-all duration-300 text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
          >
            Comprar Ahora
          </button>
        </div>
      </div>
    </div>
  )
}
