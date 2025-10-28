# Guía Rápida de Instalación

## 🚀 Instalación en 5 Pasos

### 1️⃣ Desplegar el Frontend

El frontend ya está actualizado con las nuevas rutas. Solo necesitas desplegar:

```bash
npm run build
# Luego despliega el contenido de /dist a Cloudflare Pages
```

### 2️⃣ Instalar el Plugin en WordPress

1. Accede a tu servidor WordPress por FTP/SSH
2. Ve a: `/wp-content/plugins/`
3. Crea carpeta: `casa-alba-headless-checkout`
4. Copia el archivo: `wordpress-plugin/casa-alba-headless-checkout.php`
5. En WordPress Admin: **Plugins** → Activar "Casa Alba - Headless Checkout URLs"

### 3️⃣ Configurar la URL del Frontend

Edita `wp-config.php` y agrega (antes de "That's all, stop editing!"):

```php
define('CASA_ALBA_FRONTEND_URL', 'https://productoscasaalba.cl');
```

### 4️⃣ Verificar las Páginas

Abre en el navegador:
- ✅ `https://productoscasaalba.cl/pedido-recibido` - Debe cargar (mostrará error si no hay order_id)
- ✅ `https://productoscasaalba.cl/pedido-cancelado` - Debe cargar

### 5️⃣ Probar el Flujo Completo

1. Agrega productos al carrito
2. Procede al checkout
3. Completa el pago **O** cancélalo
4. Verifica que redirija correctamente al frontend

## ✅ Checklist de Verificación

- [ ] Plugin instalado y activado en WordPress
- [ ] URL del frontend configurada en `wp-config.php`
- [ ] Frontend desplegado con las nuevas rutas
- [ ] Rutas `/pedido-recibido` y `/pedido-cancelado` accesibles
- [ ] Prueba de flujo completo realizada

## 🐛 Si Algo No Funciona

### Los clientes siguen yendo al CMS

1. Verifica que el plugin esté **activado**
2. Confirma `CASA_ALBA_FRONTEND_URL` en `wp-config.php`
3. Limpia el caché de WordPress (si usas caché)

### Error 404 en las páginas

1. Verifica que el frontend esté actualizado y desplegado
2. Limpia el caché del navegador
3. Revisa la consola del navegador para errores

### Para Ver los Logs

Edita `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Logs en: `/wp-content/debug.log`
Busca: `Casa Alba Headless`

## 📞 Soporte

Revisa la documentación completa en `SOLUCION_CANCELACION.md` o el README del plugin en `wordpress-plugin/README.md`.

---

**Tiempo estimado de instalación:** 10-15 minutos
