import {Outlet} from "react-router/internal/react-server-client";
import {Footer} from "@/components/layout/components/footer.tsx";
import {Header} from "@/components/layout/components/header.tsx";
import { CartProvider } from "@/contexts/CartContext";
import {Toaster} from "react-hot-toast";
import { CartSidebar } from "@/components/cart-sidebar";
import { ConsentBanner } from "@/components/consent-banner";
import { useState } from "react";
import { MaintenanceWrapper } from "@/components/MaintenanceWrapper";

export const Layout = () => {
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  const openCartSidebar = () => setIsCartSidebarOpen(true);
  const closeCartSidebar = () => setIsCartSidebarOpen(false);

  return (
    <MaintenanceWrapper>
      <div className={"w-full min-h-screen bg-neutral-50 font-pacifico"}>
        <CartProvider>
          <Header onCartClick={openCartSidebar} />
          <Toaster/>

          <main className={"min-h-screen my-5"}>
            <Outlet/>
          </main>

          <Footer/>

          <CartSidebar
            isOpen={isCartSidebarOpen}
            onClose={closeCartSidebar}
          />

          <ConsentBanner />
        </CartProvider>
      </div>
    </MaintenanceWrapper>
  );
};
