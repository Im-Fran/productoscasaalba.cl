import {createContext, useContext} from "react";
import type {MaintenanceContextType} from "@/contexts/MaintenanceContext.tsx";

export const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const useMaintenanceContext = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenanceContext must be used within a MaintenanceProvider');
  }
  return context;
};