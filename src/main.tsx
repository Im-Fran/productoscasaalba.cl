import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import {router} from "./router.tsx";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";

createRoot(document.getElementById('root')!).render(
  <MaintenanceProvider>
    <AuthProvider>
      <RouterProvider
        router={router}
      />
    </AuthProvider>
  </MaintenanceProvider>
)
