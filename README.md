# 🔐 Velum

**Zero-Knowledge Password Manager**

Velum es un gestor de contraseñas construido bajo el modelo **Zero-Knowledge**: el servidor nunca tiene acceso a las contraseñas en texto plano. Todo el cifrado y descifrado ocurre en el navegador del usuario.

---

## 🚀 Stack Técnico

| Capa                   | Tecnología                                      |
| :--------------------- | :---------------------------------------------- |
| **Frontend**           | React 19 + TypeScript + Vite                    |
| **Backend**            | Node.js + Express                               |
| **Base de Datos**      | MongoDB Atlas                                   |
| **Autenticación**      | JWT + bcrypt                                    |
| **Cifrado**            | Web Crypto API (PBKDF2 600k + AES-GCM 256 bits) |
| **Servidor**           | Google Cloud VM e2-micro (Ubuntu 22.04)         |
| **Proxy Inverso**      | Nginx                                           |
| **Gestor de Procesos** | PM2                                             |
| **HTTPS**              | Let's Encrypt / Certbot                         |
| **Calidad de código**  | ESLint + Prettier                               |

---

## 🏗️ Arquitectura

```
[Usuario] → HTTPS → [Nginx en VM] → [Node.js/Express API] → [MongoDB Atlas]
                ↓
        [Archivos estáticos React]
```

---

## 🔒 Modelo Zero-Knowledge

1. El usuario ingresa su **contraseña maestra** en el navegador.
2. El frontend deriva una clave de cifrado con **PBKDF2** (600,000 iteraciones, SHA-256) + el **salt del usuario**.
3. Los datos se cifran con **AES-GCM 256 bits** en el navegador, con un **IV único** por operación.
4. Solo el **texto cifrado** (blob) se envía al servidor.
5. El servidor almacena el blob sin poder descifrarlo.
6. Al recuperar, el descifrado ocurre únicamente en el navegador.

**El servidor nunca conoce la contraseña maestra, ni las contraseñas almacenadas, ni los nombres de los bolsillos.**

---

## ✨ Features

- ✅ Registro e inicio de sesión con JWT
- ✅ Cifrado Zero-Knowledge (PBKDF2 + AES-GCM)
- ✅ Desbloqueo verificado (detecta contraseña maestra incorrecta)
- ✅ CRUD de contraseñas cifradas
- ✅ **Bolsillos (carpetas) cifrados** para organizar contraseñas
- ✅ **Buscador** por título o usuario
- ✅ **Ordenamiento**: recientes, antiguos, A-Z, Z-A
- ✅ **Fecha de creación** visible en cada tarjeta
- ✅ Copiar usuario/contraseña al portapapeles
- ✅ Mostrar/ocultar contraseñas
- ✅ Rate limiting en autenticación
- ✅ CORS restringido
- ✅ Manejo de errores sin exponer detalles internos

---

## 📁 Estructura del Proyecto

```
velum/
├── backend/
│   ├── src/
│   │   ├── config/         # Conexión a MongoDB y validación de env
│   │   ├── controllers/    # Lógica de rutas
│   │   ├── middleware/     # Auth, errores, rate limiting
│   │   ├── models/         # Esquemas de Mongoose
│   │   ├── routes/         # Endpoints de la API
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Cliente HTTP
│   │   ├── components/     # Dashboard, AuthModal, etc.
│   │   ├── context/        # AuthContext
│   │   ├── crypto/         # Web Crypto API
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

---

## 🛠️ Instalación Local

### Requisitos previos

- Node.js v20 o superior
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (plan gratuito M0)

### Backend

1. Clona el repositorio:

```bash
git clone https://github.com/DarkDieval/velum.git
cd velum/backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea tu archivo `.env` (usa `.env.example` como base):

```bash
cp .env.example .env
```

4. Configura las variables de entorno:

```env
PORT=4000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/velum_db
JWT_SECRET=tu_clave_secreta_larga_y_segura
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

5. Arranca el backend:

```bash
npm run dev
```

### Frontend

En otra terminal:

```bash
cd velum/frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## 📡 Endpoints de la API

| Método   | Endpoint           | Descripción                            | Auth |
| :------- | :----------------- | :------------------------------------- | :--- |
| `GET`    | `/api/health`      | Estado del servidor                    | ❌   |
| `POST`   | `/api/auth/signup` | Registro de usuario                    | ❌   |
| `POST`   | `/api/auth/signin` | Inicio de sesión (devuelve JWT + salt) | ❌   |
| `GET`    | `/api/vault`       | Obtener blobs cifrados del usuario     | ✅   |
| `POST`   | `/api/vault`       | Guardar un blob cifrado                | ✅   |
| `DELETE` | `/api/vault/:id`   | Eliminar un blob                       | ✅   |

**Nota sobre los bolsillos**: El campo `folder` va **dentro del blob cifrado**, así el servidor no sabe cuántos bolsillos tiene un usuario ni cuántos ítems hay en cada uno. Es una decisión de diseño consciente para mantener la promesa Zero-Knowledge.

---

## 🔐 Decisiones de Seguridad

| Medida                               | Propósito                                                 |
| :----------------------------------- | :-------------------------------------------------------- |
| **bcrypt** para contraseñas de login | Hash con salt, defensa contra rainbow tables              |
| **PBKDF2 600k iteraciones**          | Encarece ataques offline (recomendación OWASP)            |
| **AES-GCM**                          | Cifrado autenticado (integridad + confidencialidad)       |
| **IV único por cifrado**             | Evita reutilización de IV (crítico en AES-GCM)            |
| **Salt por usuario**                 | Permite derivar la clave una sola vez por sesión          |
| **Derived key en memoria**           | No se persiste; se re-deriva al recargar                  |
| **Verificación al desbloquear**      | Descifra un ítem real para detectar contraseña incorrecta |
| **Rate limiting**                    | 5 intentos por IP cada 15 min en auth                     |
| **CORS restringido**                 | Solo el `FRONTEND_URL` puede hacer peticiones             |
| **errorHandler sin leaks**           | No expone detalles internos de Mongo                      |

---

### Nota sobre migración de datos

Cuando se actualizan parámetros criptográficos (por ejemplo, las iteraciones de PBKDF2), los datos existentes quedan cifrados con la clave anterior y no pueden descifrarse con la nueva.

En **Velum**, actualmente se aplica una migración limpia: los usuarios deben re-registrarse y volver a guardar sus ítems. Es aceptable en un proyecto de portafolio sin datos reales.

En **producción con usuarios reales**, el patrón recomendado es una **migración con doble clave**:

1. Guardar la versión de parámetros criptográficos junto con cada ítem.
2. Al desbloquear, derivar la clave con los parámetros originales para descifrar ítems viejos.
3. Re-cifrar los ítems con los parámetros nuevos.
4. Guardar el cambio.

Este es el enfoque que usan gestores como Bitwarden o 1Password cuando actualizan parámetros.

---

## 📜 Scripts Disponibles

### Backend

| Comando          | Descripción                       |
| :--------------- | :-------------------------------- |
| `npm run start`  | Inicia el servidor en producción  |
| `npm run dev`    | Inicia el servidor con hot reload |
| `npm run lint`   | Ejecuta ESLint                    |
| `npm run format` | Formatea con Prettier             |

### Frontend

| Comando           | Descripción                                |
| :---------------- | :----------------------------------------- |
| `npm run dev`     | Servidor de desarrollo en `localhost:5173` |
| `npm run build`   | Compila para producción                    |
| `npm run preview` | Previsualiza el build de producción        |

---

## 🗺️ Roadmap

- [x] Infraestructura (VM, dominio, MongoDB Atlas)
- [x] Backend base (Express + Mongoose)
- [x] Autenticación con JWT + bcrypt
- [x] Calidad de código (ESLint + Prettier)
- [x] Backend del cifrado Zero-Knowledge
- [x] Frontend con React + TypeScript
- [x] Registro, Login y Dashboard
- [x] Cifrado real con Web Crypto API
- [x] Bolsillos (folders) y buscador
- [ ] Despliegue en producción (Nginx + Certbot)
- [x] Auto-bloqueo por inactividad
- [x] Limpiar portapapeles tras 30s

---

## 👤 Autor

**DarkDieval**

- GitHub: [@DarkDieval](https://github.com/DarkDieval)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

### Limitación conocida: Autenticación y Zero-Knowledge

En el diseño **actual**, la contraseña maestra se envía al servidor durante `signin` (hasheada con bcrypt para verificar identidad). Esto significa que **técnicamente**, un servidor malicioso o comprometido podría derivar la clave de cifrado usando el `salt` del usuario y la contraseña maestra en claro. Este es un trade-off consciente de la versión de portafolio.

La solución completa (que usan Bitwarden y 1Password) es **derivar dos valores distintos en el cliente**:

1. `masterKey` = PBKDF2(contraseña maestra + email) → **nunca sale del navegador**, cifra los datos.
2. `authHash` = PBKDF2(masterKey + contraseña maestra) → **solo este se envía al servidor** para autenticación.

El servidor nunca ve ni la contraseña maestra ni la clave de cifrado. Está en el roadmap como mejora post-despliegue.
