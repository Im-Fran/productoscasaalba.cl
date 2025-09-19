import React, { useEffect, type ReactNode } from 'react';
import { useMaintenanceContext } from '@/contexts/MaintenanceContext';
import { setMaintenanceCallback } from '@/utils/axios';
import MaintenancePage from '@/pages/maintenance';

interface MaintenanceWrapperProps {
  children: ReactNode;
}

export const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const { isMaintenanceMode, setMaintenanceMode } = useMaintenanceContext();

  useEffect(() => {
    // Configurar el callback para axios
    setMaintenanceCallback(setMaintenanceMode);
  }, [setMaintenanceMode]);

  // Si está en modo mantenimiento, mostrar la página de mantenimiento
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // Si no está en mantenimiento, mostrar el contenido normal
  return <>{children}</>;
};
