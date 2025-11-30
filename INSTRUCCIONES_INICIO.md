
# 🚀 INSTRUCCIONES DE INICIO - LUWAK MANAGER

## ⚠️ ANTES DE INTENTAR INICIAR SESIÓN

**PASO OBLIGATORIO**: Debes crear los usuarios en la base de datos primero.

---

## 📋 Pasos para Iniciar

### 1️⃣ Iniciar el servidor

```bash
npm run dev
```

Espera a que veas:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

---

### 2️⃣ Crear usuarios (SOLO LA PRIMERA VEZ)

Abre tu navegador y ve a:

```
http://localhost:3000/next_api/seed
```

**Deberías ver**:
```json
{
  "success": true,
  "message": "Datos semilla creados exitosamente"
}
```

**En la terminal deberías ver**:
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

### 3️⃣ Iniciar sesión

Ahora ve a:

```
http://localhost:3000/login
```

Usa cualquiera de estos usuarios:

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |
| `mesero1` | `mesero123` |
| `cajero1` | `cajero123` |
| `chef1` | `chef123` |
| `ayudante1` | `ayudante123` |

---

## ✅ Verificación

Si todo funcionó correctamente:

1. ✅ El seed muestra "success: true"
2. ✅ La terminal muestra la lista de usuarios
3. ✅ Puedes iniciar sesión sin errores
4. ✅ Ves la página de inicio con productos

---

## ❌ Solución de Problemas

### Problema: "Usuario o contraseña incorrectos"

**Causa**: Los usuarios no existen en la base de datos

**Solución**:
1. Ejecuta el seed: `http://localhost:3000/next_api/seed`
2. Verifica que aparezca "success: true"
3. Intenta iniciar sesión de nuevo

---

### Problema: Error 500 al ejecutar seed

**Causa**: Problema de conexión con la base de datos

**Solución**:
1. Verifica que PostgreSQL esté corriendo
2. Verifica las variables de entorno en `.env.local`
3. Revisa los logs en la terminal

---

### Problema: No aparece nada al ejecutar seed

**Causa**: El servidor no está corriendo

**Solución**:
1. Asegúrate de que `npm run dev` esté corriendo
2. Verifica que no haya errores en la terminal
3. Intenta acceder a `http://localhost:3000` primero

---

## 🔍 Verificar Base de Datos (Opcional)

Si quieres verificar manualmente:

```sql
-- Conectar a PostgreSQL
psql -U postgres -d tu_base_de_datos

-- Ver usuarios
SELECT username, password, role_type FROM users;

-- Deberías ver 5 usuarios
```

---

## 📝 Resumen Rápido

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir navegador en:
http://localhost:3000/next_api/seed

# 3. Esperar mensaje de éxito

# 4. Ir a login:
http://localhost:3000/login

# 5. Usar: admin / admin123
```

---

## 🆘 Ayuda Adicional

Si después de seguir todos estos pasos TODAVÍA no funciona:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta iniciar sesión
4. Copia cualquier error que aparezca
5. Revisa también los logs en la terminal del servidor

---

## ⚠️ IMPORTANTE

- **Solo ejecuta el seed UNA VEZ**
- Si ya lo ejecutaste, los usuarios ya existen
- Si ves "usuario ya existe", está bien
- No necesitas ejecutar el seed cada vez que inicies el servidor
