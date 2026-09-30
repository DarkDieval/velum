# 🔐 Velum

**Zero-Knowledge Password Manager**

Velum es un gestor de contraseñas construido bajo el modelo **Zero-Knowledge**: el servidor nunca tiene acceso a las contraseñas en texto plano. Todo el cifrado y descifrado ocurre en el navegador del usuario.

---

## 🚀 Stack Técnico

| Capa                   | Tecnología                              |
| :--------------------- | :-------------------------------------- |
| **Frontend**           | React + TypeScript + Vite               |
| **Backend**            | Node.js + Express                       |
| **Base de Datos**      | MongoDB Atlas                           |
| **Autenticación**      | JWT + bcrypt                            |
| **Cifrado**            | Web Crypto API (AES-GCM 256 bits)       |
| **Servidor**           | Google Cloud VM e2-micro (Ubuntu 22.04) |
| **Proxy Inverso**      | Nginx                                   |
| **Gestor de Procesos** | PM2                                     |
| **HTTPS**              | Let's Encrypt / Certbot                 |

---

## 🏗️ Arquitectura

```
[Usuario] → HTTPS → [Nginx en VM] → [Node.js/Express API] → [MongoDB Atlas]
                ↓
        [Archivos estáticos React]
```

---

## 🔒 Modelo Zero-Knowledge

1. El usuario ingresa su contraseña maestra en el navegador.
2. El frontend deriva una clave de cifrado usando PBKDF2 (Web Crypto API).
3. Los datos se cifran con AES-GCM 256 bits en el navegador.
4. Solo el texto cifrado se envía al servidor.
5. El servidor almacena el blob sin poder descifrarlo.

**El servidor nunca conoce la contraseña maestra ni las contraseñas almacenadas.**

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
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── crypto/
│   └── package.json
│
└── README.md
```

---

## 🛠️ Instalación Local

### Requisitos previos

- Node.js v20 o superior
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (plan gratuito M0)

### Pasos

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
NODE_ENV=development
```

5. Arranca el servidor en modo desarrollo:

```bash
npm run dev
```

6. La API estará disponible en `http://localhost:4000`

---

## 📡 Endpoints de la API

| Método   | Endpoint           | Descripción                        | Auth |
| :------- | :----------------- | :--------------------------------- | :--- |
| `GET`    | `/api/health`      | Estado del servidor                | ❌   |
| `POST`   | `/api/auth/signup` | Registro de usuario                | ❌   |
| `POST`   | `/api/auth/signin` | Inicio de sesión (devuelve JWT)    | ❌   |
| `GET`    | `/api/vault`       | Obtener blobs cifrados del usuario | ✅   |
| `POST`   | `/api/vault`       | Guardar un blob cifrado            | ✅   |
| `DELETE` | `/api/vault/:id`   | Eliminar un blob                   | ✅   |

---

## 📜 Scripts Disponibles

| Comando            | Descripción                              |
| :----------------- | :--------------------------------------- |
| `npm run start`    | Inicia el servidor en producción         |
| `npm run dev`      | Inicia el servidor con hot reload        |
| `npm run lint`     | Ejecuta ESLint                           |
| `npm run lint:fix` | Ejecuta ESLint y corrige automáticamente |
| `npm run format`   | Formatea el código con Prettier          |

---

## 🗺️ Roadmap

- [x] **Fase 1-3**: Infraestructura (VM, dominio, MongoDB Atlas)
- [x] **Fase 4**: Backend base (Express + Mongoose)
- [x] **Fase 5**: Autenticación con JWT + bcrypt
- [x] **Fase 5.5**: ESLint + Prettier
- [x] **Fase 6**: Backend del cifrado Zero-Knowledge
- [ ] **Fase 7**: Frontend (Registro, Login, Dashboard)
- [ ] **Fase 8**: Cifrado real con Web Crypto API
- [ ] **Fase 9**: Despliegue en producción (Nginx + Certbot)

---

## 👤 Autor

**DarkDieval**

- GitHub: [@DarkDieval](https://github.com/DarkDieval)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
