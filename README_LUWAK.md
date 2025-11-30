
# LUWAK MANAGER - Sistema POS para Cafetería

## 🚨 SOLUCIÓN INMEDIATA - LEE ESTO PRIMERO

### ❌ PROBLEMA: "No puedo iniciar sesión"

**CAUSA**: Los usuarios NO existen en la base de datos todavía.

**SOLUCIÓN EN 2 PASOS**:

### PASO 1: Crear usuarios en la base de datos

Abre tu navegador y ve a esta URL:

```
http://localhost:3000/next_api/seed
```

Verás un mensaje como:
```json
{
  "success": true,
  "message": "Datos semilla creados exitosamente"
}
```

### PASO 2: Iniciar sesión

Ahora SÍ puedes iniciar sesión en:

```
http://localhost:3000/login
```

Con cualquiera de estos usuarios:

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |
| `mesero1` | `mesero123` |
| `cajero1` | `cajero123` |
| `chef1` | `chef123` |
| `ayudante1` | `ayudante123` |

---

## 🔍 ¿Cómo saber si funcionó?

En la terminal donde ejecutas `npm run dev` deberías ver:

```
============================================================
USUARIOS DE PRUEBA:
============================================================
ADMIN        | usuario: admin        | contraseña: admin123
MESERO       | usuario: mesero1      | contraseña: mesero123
CAJERO       | usuario: cajero1      | contraseña: cajero123
CHEF         | usuario: chef1        | contraseña: chef123
AYUDANTE     | usuario: ayudante1    | contraseña: ayudante123
============================================================
```

---

## ⚠️ IMPORTANTE

- **Solo ejecuta el seed UNA VEZ**
- Si ya lo ejecutaste antes, los usuarios ya existen
- Si ves "usuario ya existe", está bien, significa que ya están creados

---

## 🐛 Si TODAVÍA no funciona

### Opción A: Verificar en la base de datos

```sql
-- Conectar a PostgreSQL
psql -U postgres -d tu_base_de_datos

-- Ver si existen usuarios
SELECT username, password, role_type FROM users;
```

Deberías ver los 5 usuarios listados.

### Opción B: Recrear usuarios

Si los usuarios no aparecen, ejecuta esto en PostgreSQL:

```sql
-- Borrar usuarios existentes (si los hay)
DELETE FROM employees;
DELETE FROM users;

-- Luego ejecuta el seed de nuevo
```

Y vuelve a abrir: `http://localhost:3000/next_api/seed`

---

## 📝 Flujo Completo

1. **Iniciar servidor**: `npm run dev`
2. **Crear usuarios**: Abre `http://localhost:3000/next_api/seed`
3. **Iniciar sesión**: Abre `http://localhost:3000/login`
4. **Usar**: `admin` / `admin123`

---

## 🔐 Usuarios de Prueba

Después de ejecutar el seed:

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| **👨‍💼 Administrador** | `admin` | `admin123` |
| **🍽️ Mesero** | `mesero1` | `mesero123` |
| **💰 Cajero** | `cajero1` | `cajero123` |
| **👨‍🍳 Chef** | `chef1` | `chef123` |
| **🧑‍🍳 Ayudante** | `ayudante1` | `ayudante123` |

---

## 📊 Características del Sistema

- ✅ **Autenticación por usuario y contraseña**
- ✅ **Catálogo de productos** con variantes
- ✅ **Gestión de pedidos** con estados visuales
- ✅ **Sistema de pagos** (Efectivo y Yape)
- ✅ **Notas de compra** para inventario
- ✅ **Dashboard** con análisis de ventas
- ✅ **Gestión de empleados** (solo admin)
- ✅ **Responsive** para PC, tablet y móvil
- ✅ **Modo oscuro/claro**

---

## 🛠️ Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Estilos**: Tailwind CSS v4
- **UI**: shadcn/ui
- **Base de datos**: PostgreSQL (via PostgREST)
- **Autenticación**: JWT
- **Upload**: @zoerai/integration

---

## 📞 Soporte Rápido

**¿No puedes iniciar sesión?**
1. ✅ Ejecuta: `http://localhost:3000/next_api/seed`
2. ✅ Espera el mensaje de éxito
3. ✅ Intenta login con `admin` / `admin123`

**¿Sigue sin funcionar?**
1. Abre F12 en el navegador
2. Ve a la pestaña "Console"
3. Intenta iniciar sesión
4. Copia cualquier error que veas

**¿Error de base de datos?**
1. Verifica que PostgreSQL esté corriendo
2. Verifica las variables de entorno
3. Revisa los logs del servidor en la terminal
