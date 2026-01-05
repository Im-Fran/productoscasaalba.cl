import {Txtrvl} from "txtrvl";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import {Instagram} from "lucide-react";
import {cdnEndpoint} from "@/utils/constants.ts";

const rollingTxt = [
  "Contáctanos",
  "Síguenos",
  "¡Pruébanos!"
]

// Custom TikTok icon component
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

// Custom WhatsApp icon component
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export const Footer = () => {

  const [rollingTxtVisible, setRollingTxtVisible] = useState(true)
  const [rollingTxtIdx, setRollingTxtIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Cambia el índice del texto cada 3 segundos
      setRollingTxtVisible(false)
      setTimeout(() => {
        setRollingTxtIdx(prevIdx => (prevIdx + 1) % rollingTxt.length);
        setRollingTxtVisible(true);
      }, 500); // Tiempo de espera antes de mostrar el nuevo texto
    }, 2000); // Cambia el texto cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  return <footer id={"footer"} className={"mt-auto p-4 text-center bg-mint-500 text"}>
    <div className={"grid grid-cols-3 gap-10 container mx-auto w-full"}>
      <div className={"col-span-1 flex flex-col items-start gap-5"}>
        <h3 className={"text-xl text-red-800"}>¿Alguien dijo limpieza?</h3>
        <Txtrvl
          className={"text-gray-500"}
          text={rollingTxt[rollingTxtIdx] || 'Contáctanos'}
          manualTrigger={{ isVisible: rollingTxtVisible }}
        />

        <section id={"footer-social"}>
          <ul className={"flex items-center gap-4"}>
            <li>
              <Link to={"https://instagram.com/productoscasaalba"} className={"flex items-center gap-2 text-gray-600 hover:text-gray-900"}>
                <Instagram size={20} />
                <span>Instagram</span>
              </Link>
            </li>
            <li>
              <Link to={"https://tiktok.com/@productoscasaalba"} className={"flex items-center gap-2 text-gray-600 hover:text-gray-900"}>
                <TikTokIcon size={20} />
                <span>TikTok</span>
              </Link>
            </li>
            <li>
              <Link to={"https://www.whatsapp.com/catalog/56942717395/?app_absent=0"} className={"flex items-center gap-2 text-gray-600 hover:text-gray-900"}>
                <WhatsAppIcon size={20} />
                <span>WhatsApp</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <div className={"col-span-1 flex flex-col items-center gap-5"}>
        <img
          src={`${cdnEndpoint}/casaalba.webp`}
          alt={"Casa Alba Logo"}
          className={"h-24 lg:h-32 xl:h-40 object-contain"}
        />
      </div>
      <div className={"col-span-1 flex flex-col items-end gap-5"}>
        <img
          src={`${cdnEndpoint}/images/burbujas.webp`}
          alt={"Burbujas decorativas"}
          className={"h-24 lg:h-32 xl:h-40 object-contain"}
        />
      </div>
    </div>
  </footer>
}