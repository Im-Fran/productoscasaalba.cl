import {Txtrvl} from "txtrvl";
import {Link} from "react-router";
import CasaAlbaLogo from "@/assets/casaalba.webp";
import Burbujas from "@/assets/images/burbujas.webp";
import {useEffect, useState} from "react";

const rollingTxt = [
  "Contáctanos",
  "Síguenos",
  "¡Pruébanos!"
]

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
        <h3 className={"text-xl text-fuchsia-600"}>¿Alguien dijo Limpieza?</h3>
        <Txtrvl
          className={"text-gray-500"}
          text={rollingTxt[rollingTxtIdx] || 'Contáctanos'}
          manualTrigger={{ isVisible: rollingTxtVisible }}
        />

        <section id={"footer-social"}>
          <ul className={"flex items-center gap-4"}>
            <li>
              <Link to={"https://instagram.com/productoscasaalba"} className={"text-gray-600 hover:text-gray-900"}>
                Instagram
              </Link>
            </li>
            <li>
              <Link to={"https://tiktok.com/@productoscasaalba"} className={"text-gray-600 hover:text-gray-900"}>
                TikTok
              </Link>
            </li>
            <li>
              <Link to={"https://www.whatsapp.com/catalog/56942717395/?app_absent=0"} className={"text-gray-600 hover:text-gray-900"}>
                WhatsApp
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <div className={"col-span-1 flex flex-col items-center gap-5"}>
        <img
          src={CasaAlbaLogo}
          alt={"Casa Alba Logo"}
          className={"h-24 lg:h-32 xl:h-40 object-contain"}
        />
      </div>
      <div className={"col-span-1 flex flex-col items-end gap-5"}>
        <img
          src={Burbujas}
          alt={"Burbujas decorativas"}
          className={"h-24 lg:h-32 xl:h-40 object-contain"}
        />
      </div>
    </div>
  </footer>
}