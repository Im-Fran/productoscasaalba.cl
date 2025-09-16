import {createContext, useContext} from "react";
import type {CartContextType} from "@/contexts/CartContext.tsx";

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};