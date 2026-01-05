import { MaintenanceContext } from "@/hooks/useMaintenace";
import {useState, type ReactNode, type FC} from 'react';

export interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: (isActive: boolean) => void;
}

export interface MaintenanceProviderProps {
  children: ReactNode;
}

export const MaintenanceProvider: FC<MaintenanceProviderProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const setMaintenanceMode = (isActive: boolean) => {
    setIsMaintenanceMode(isActive);
  };

  const value = {
    isMaintenanceMode,
    setMaintenanceMode,
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};
