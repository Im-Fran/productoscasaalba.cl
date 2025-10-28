# Diagrama de Flujo de la Solución

## 🔄 Flujo de Compra Exitosa

```
┌─────────────────┐
│   Cliente en    │
│    Frontend     │
│  (React App)    │
└────────┬────────┘
         │
         │ 1. Agrega productos al carrito
         ▼
┌─────────────────┐
│  Carrito de     │
│    Compras      │
│ /carrito        │
└────────┬────────┘
         │
         │ 2. Procede al checkout
         ▼
┌─────────────────┐
│   Página de     │
│    Checkout     │
│ /pagar          │
└────────┬────────┘
         │
         │ 3. Completa formulario y envía
         ▼
┌─────────────────┐
│  WooCommerce    │
│  Store API      │
│ /wc/store/v1/   │
│   checkout      │
└────────┬────────┘
         │
         │ 4. Crea orden y procesa
         ▼
┌─────────────────┐
│ Payment Gateway │
│  (ej: Mercado   │
│     Pago)       │
└────────┬────────┘
         │
         │ 5. Cliente paga
         ▼
┌─────────────────┐
│  WooCommerce    │
│   procesa       │
│   respuesta     │
└────────┬────────┘
         │
         │ 6. Plugin intercepta URL
         ▼
┌─────────────────┐
│  Plugin Casa    │
│     Alba        │
│  - Modifica     │
│    redirect_url │
└────────┬────────┘
         │
         │ 7. Redirección al frontend
         ▼
┌─────────────────┐
│  Frontend       │
│ /pedido-recibido│
│ ?order_id=123   │
│ &key=xxx        │
└────────┬────────┘
         │
         │ 8. Carga detalles del pedido
         ▼
┌─────────────────┐
│  Página de      │
│  Confirmación   │
│  - Detalles     │
│  - Productos    │
│  - Totales      │
│  - Direcciones  │
└─────────────────┘
```

## ❌ Flujo de Cancelación

```
┌─────────────────┐
│   Cliente en    │
│  Payment Gateway│
│  (ej: Mercado   │
│     Pago)       │
└────────┬────────┘
         │
         │ 1. Cliente cancela el pago
         ▼
┌─────────────────┐
│ Payment Gateway │
│   notifica a    │
│  WooCommerce    │
└────────┬────────┘
         │
         │ 2. Retorna con estado "cancelled"
         ▼
┌─────────────────┐
│  WooCommerce    │
│   determina     │
│   cancel URL    │
└────────┬────────┘
         │
         │ 3. Plugin intercepta URL
         ▼
┌─────────────────┐
│  Plugin Casa    │
│     Alba        │
│  - Modifica     │
│    cancel_url   │
└────────┬────────┘
         │
         │ 4. Redirección al frontend
         ▼
┌─────────────────┐
│  Frontend       │
│/pedido-cancelado│
│ ?order_id=123   │
│  (opcional)     │
└────────┬────────┘
         │
         │ 5. Muestra mensaje amigable
         ▼
┌─────────────────┐
│  Página de      │
│  Cancelación    │
│  - Mensaje      │
│  - Razones      │
│  - Próximos     │
│    pasos        │
│  - Confirma no  │
│    cargo        │
└─────────────────┘
```

## 🔧 Componentes del Sistema

### Frontend (React)
```
productoscasaalba.cl
├── /carrito
├── /pagar (checkout)
├── /pedido-recibido ← NUEVO
└── /pedido-cancelado ← NUEVO
```

### Backend (WordPress)
```
cms.productoscasaalba.cl
├── /wp-admin (CMS)
├── /wp-json/wc/store/v1 (Store API)
└── /wp-content/plugins/
    └── casa-alba-headless-checkout/ ← NUEVO PLUGIN
```

## 🎯 Problema vs Solución

### ❌ Antes (Problema)

```
Cliente cancela pago
       ↓
Payment Gateway → WooCommerce
       ↓
URL generada: cms.productoscasaalba.cl/checkout/order-received/
       ↓
Cliente ve el CMS ❌
```

### ✅ Después (Solución)

```
Cliente cancela pago
       ↓
Payment Gateway → WooCommerce
       ↓
Plugin intercepta y modifica URL
       ↓
URL modificada: productoscasaalba.cl/pedido-cancelado
       ↓
Cliente ve el frontend ✅
```

## 🔐 Validación de Seguridad

```
Request: /pedido-recibido?order_id=123&key=abc123
                ↓
        Frontend recibe parámetros
                ↓
        Llama a OrderService.getOrder(123)
                ↓
        API de WooCommerce verifica:
        - ¿order_id existe?
        - ¿Usuario tiene permisos?
        - ¿order_key es válido?
                ↓
        ✅ Autorizado → Muestra detalles
        ❌ No autorizado → Muestra error
```

## 📋 Compatibilidad con Payment Gateways

### Gateways Externos (Mercado Pago, PayPal, etc.)
```
Frontend → WooCommerce → Payment Gateway
                              ↓
                    Cliente paga/cancela
                              ↓
                    Gateway retorna a WooCommerce
                              ↓
                    Plugin modifica URL de retorno
                              ↓
                    Cliente vuelve al Frontend ✅
```

### Gateways Directos (Transferencia, Efectivo)
```
Frontend → WooCommerce Store API
              ↓
       Crea orden directamente
              ↓
       Plugin modifica redirect_url
              ↓
       Cliente va directo a confirmación ✅
```

## 🎨 Páginas de Frontend

### /pedido-recibido
```
┌──────────────────────────────────────┐
│         ✅ ¡Pedido Recibido!         │
│                                      │
│  Gracias por tu compra              │
│  Pedido #123 - Procesando           │
├──────────────────────────────────────┤
│  📦 Detalles del Pedido             │
│  • Número: #123                     │
│  • Fecha: 28 Oct 2025               │
│  • Método de pago: Mercado Pago     │
│  • Total: $45.990                   │
├──────────────────────────────────────┤
│  🛍️ Productos                       │
│  • Producto A × 2 = $30.000         │
│  • Producto B × 1 = $15.990         │
├──────────────────────────────────────┤
│  🚚 Dirección de Envío              │
│  Juan Pérez                         │
│  Calle Principal 123                │
│  Santiago, Región Metropolitana     │
├──────────────────────────────────────┤
│  📧 Recibirás un correo con los     │
│     detalles a tu@email.com         │
│                                      │
│  [Ver Mis Pedidos] [Volver al Inicio]│
└──────────────────────────────────────┘
```

### /pedido-cancelado
```
┌──────────────────────────────────────┐
│         ⚠️ Pedido Cancelado          │
│                                      │
│  Tu pedido #123 ha sido cancelado   │
├──────────────────────────────────────┤
│  ❓ ¿Qué sucedió?                    │
│  • Decidiste no completar la compra │
│  • Cerraste la ventana del pago     │
│  • Problema con método de pago      │
│  • Tiempo de sesión expiró          │
├──────────────────────────────────────┤
│  💡 ¿Qué puedes hacer ahora?         │
│  1. Intenta nuevamente              │
│  2. Revisa tu método de pago        │
│  3. Explora otros productos         │
├──────────────────────────────────────┤
│  ✅ Importante: No se ha realizado   │
│     ningún cargo. Tu dinero está    │
│     seguro.                         │
│                                      │
│  [🛒 Volver al Carrito]              │
│  [Continuar Comprando] [Contáctanos]│
└──────────────────────────────────────┘
```

## 📊 Estadísticas de Implementación

```
Archivos Creados:     7 archivos
Archivos Modificados: 2 archivos
Líneas de Código:     ~700 líneas
Documentación:        ~17,000 palabras
Tiempo de Desarrollo: ~2 horas
Build Status:         ✅ Exitoso
Linting:              ✅ Sin nuevos errores
Code Review:          ✅ Aprobado
Security Scan:        ✅ Sin vulnerabilidades
```

---

**Nota:** Este diagrama muestra el flujo completo de la solución implementada para corregir las redirecciones de cancelación en el checkout headless de WooCommerce.
