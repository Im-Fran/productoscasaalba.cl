import { createBrowserRouter } from "react-router";
import {HomePage} from "./pages/home";
import {ProductPage} from "./pages/products/product-page.tsx";
import {ProductsPage} from "./pages/products";
import {Layout} from "./components/layout/layout.tsx";
import CartPage from "@/pages/cart";
import ContactPage from "@/pages/contact";
import ReviewsPage from "@/pages/reviews";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password";
import { ResetPasswordPage } from "@/pages/auth/reset-password";
import CheckoutPage from "@/pages/checkout";
import ErrorPage from "@/pages/error";
import AccountPage from "@/pages/account";
import OrdersPage from "@/pages/orders";
import OrderReceivedPage from "@/pages/order-received";
import OrderCancelledPage from "@/pages/order-cancelled";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomePage },
      { path: "/productos", Component: ProductsPage },
      { path: "/productos/:slug", Component: ProductPage },
      { path: "/carrito", Component: CartPage },
      { path: "/pagar", Component: CheckoutPage },
      { path: "/pedido-recibido", Component: OrderReceivedPage },
      { path: "/pedido-cancelado", Component: OrderCancelledPage },
      { path: "/cuenta", Component: AccountPage },
      { path: "/pedidos", Component: OrdersPage },
      { path: "/reviews", Component: ReviewsPage },
      { path: "/contacto", Component: ContactPage },
      { path: "/terminos-y-condiciones", Component: TermsPage },
      { path: "/politica-de-privacidad", Component: PrivacyPage },
    ]
  },

  // Rutas de autenticación sin layout
  { path: "/auth/login", Component: LoginPage },
  { path: "/auth/register", Component: RegisterPage },
  { path: "/auth/forgot-password", Component: ForgotPasswordPage },
  { path: "/auth/reset-password", Component: ResetPasswordPage },

  // Ruta de error específica
  { path: "/error", Component: ErrorPage },

  // Ruta catch-all para páginas no encontradas
  { path: "*", Component: ErrorPage },
]);