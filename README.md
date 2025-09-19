# 🏠 Productos Casa Alba - Frontend

Frontend del e-commerce **productoscasaalba.cl**, una tienda online de productos de limpieza y hogar. Este proyecto está construido con React, TypeScript y Vite, desplegado en Cloudflare Workers (static).

## 🚀 Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **TailwindCSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP para comunicación con API
- **Cloudflare Workers (Static)** - Plataforma de despliegue
- **WooCommerce API** - Backend de e-commerce (WordPress)

## 📦 Dependencias Principales

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router": "^7.8.1",
  "tailwindcss": "^4.1.12",
  "axios": "^1.11.0",
  "lucide-react": "^0.539.0",
  "swiper": "^11.2.10",
  "react-hot-toast": "^2.6.0"
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AuthGuard.tsx   # Protección de rutas autenticadas
│   ├── MaintenanceWrapper.tsx # Manejo del modo mantenimiento
│   ├── banner.tsx      # Banner promocional
│   ├── cart-sidebar.tsx # Carrito lateral
│   ├── layout/         # Componentes de layout
│   └── product-grid/   # Grilla de productos
├── contexts/           # Contextos de React
│   ├── AuthContext.tsx # Contexto de autenticación
│   ├── CartContext.tsx # Contexto del carrito
│   └── MaintenanceContext.tsx # Contexto de mantenimiento
├── hooks/              # Hooks personalizados
├── pages/              # Páginas de la aplicación
│   ├── account/        # Cuenta de usuario
│   ├── auth/          # Autenticación (login, registro)
│   ├── cart/          # Carrito de compras
│   ├── checkout/      # Proceso de pago
│   ├── contact/       # Página de contacto
│   ├── home/          # Página principal
│   ├── products/      # Páginas de productos
│   └── reviews/       # Reseñas
├── services/          # Servicios de API
├── types/             # Definiciones de tipos TypeScript
└── utils/             # Utilidades y helpers
```

## 🔧 Configuración de Desarrollo

### Prerrequisitos

- Node.js 18+ o Bun
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Im-Fran/productoscasaalba.cl
cd productoscasaalba.cl

# Instalar dependencias (usando Bun)
bun install

# O con npm
npm install
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_CMS_URL=https://cms.productoscasaalba.cl
VITE_ENV=prod
```

El `VITE_ENV` puede ser `production`, `prod` o cualquier otra cosa. 
En caso de usar un entorno de producción, se usará el proxy de vite para las llamadas a la API.

### Scripts Disponibles

```bash
# Desarrollo
bun dev          # Inicia el servidor de desarrollo
npm run dev

# Construcción
bun run build    # Construye para producción
npm run build

# Vista previa
bun run preview  # Previsualiza la construcción
npm run preview

# Linting
bun run lint     # Ejecuta ESLint
npm run lint
```

## 🌐 Funcionalidades

### 🛒 E-commerce
- **Catálogo de productos** con filtros y búsqueda
- **Carrito de compras** persistente
- **Proceso de checkout** completo
- **Gestión de variaciones** de productos
- **Sistema de reseñas** y calificaciones

### 👤 Autenticación
- **Registro e inicio de sesión**
- **Recuperación de contraseña**
- **Perfil de usuario** con gestión de direcciones
- **Historial de pedidos**

### 🎨 Interfaz
- **Diseño responsive** con TailwindCSS
- **Componentes reutilizables**
- **Loading states** para mejor UX
- **Toast notifications** para feedback
- **Galería de imágenes** con Swiper

### 🔧 Sistema de Mantenimiento
- **Detección automática** de modo mantenimiento del backend
- **Página de mantenimiento** personalizada
- **Interceptores de Axios** para manejo de errores 503

## 🚀 Despliegue

El proyecto está configurado para desplegarse en **Cloudflare Pages**:

```bash
# Construcción para producción
bun run build

# Los archivos se generan en la carpeta dist/
```

### Configuración de Cloudflare

- **Framework**: Vite
- **Build command**: `bun run build`
- **Build output directory**: `dist`
- **Node.js version**: 18+

## 📡 Integración con Backend

### WooCommerce API
- **Productos**: Listado, detalles, variaciones
- **Categorías**: Navegación y filtros
- **Carrito**: Gestión de items
- **Órdenes**: Creación y seguimiento
- **Usuarios**: Autenticación y perfil

### Proxy de Desarrollo
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_CMS_URL,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 🛠️ Características Técnicas

### Manejo de Estados
- **Context API** para estados globales (Auth, Cart, Maintenance)
- **Custom hooks** para lógica reutilizable
- **Local storage** para persistencia

### Optimización
- **Code splitting** automático con Vite
- **Lazy loading** de componentes
- **Optimización de imágenes** con formato WebP
- **Tree shaking** para bundle más pequeño

### Tipos TypeScript
```typescript
// Tipos principales
- Product: Definición de productos WooCommerce
- Customer: Datos de cliente
- Order: Estructura de pedidos
- CartItem: Items del carrito
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es público y de código abierto bajo la licencia GNU GPL v3.

## 📞 Contacto

Para dudas o soporte técnico, contacta al equipo de desarrollo.

---

**Productos Casa Alba** - ¿Alguien dijo limpieza?
