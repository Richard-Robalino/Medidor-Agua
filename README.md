
# 📱 Lecturas de Agua

Aplicación web y móvil desarrollada con **Ionic + Angular** para la gestión de lecturas de medidores de agua del **Distrito Metropolitano de Quito**.

La app permite a los usuarios autenticarse, registrar lecturas de medidores (usando cámara y ubicación), consultar su historial y, en el caso de perfiles con permisos, visualizar todas las lecturas registradas.

---

## 📸 Capturas de pantalla

> Crea una carpeta por ejemplo `docs/img/` y guarda ahí tus imágenes.  
> Luego reemplaza las rutas de ejemplo por las tuyas.

### Pantalla de inicio de sesión (web)
![Login web](docs/img/login-web.png)

### Pantalla de inicio de sesión (móvil / APK)
![Login móvil](docs/img/login-mobile.png)

### Dashboard
![Dashboard](docs/img/dashboard.png)

### Registro de lecturas
![Nueva lectura](docs/img/new-reading.png)

---

## 🚀 Características principales

- Autenticación de usuarios (login, registro, recuperación y actualización de contraseña).
- Gestión de lecturas de medidores:
  - Registro de nuevas lecturas.
  - Listado de lecturas del propio usuario.
  - Listado general de lecturas (para perfiles con permisos).
- Uso de **cámara** (foto del medidor) mediante Capacitor.
- Uso de **geolocalización** para asociar la lectura con una ubicación.
- Interfaz responsive con diseño tipo **card** y gradientes.
- Despliegue web en **Firebase Hosting**.
- Generación de APK Android con **Capacitor** y Android Studio.

---

## 🧰 Tecnologías utilizadas

- **Framework/UI**
  - [Ionic Framework](https://ionicframework.com/)
  - [Angular](https://angular.io/)
- **Backend / BaaS**
  - [Supabase](https://supabase.com/) (autenticación y base de datos)
- **Build & Deploy**
  - Capacitor (Android)
  - Firebase Hosting (web)
- **Lenguajes**
  - TypeScript
  - HTML
  - SCSS

---

## ✅ Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Ionic CLI](https://ionicframework.com/docs/cli)  
  ```bash
  npm install -g @ionic/cli
````

* [Firebase CLI](https://firebase.google.com/docs/cli)

  ```bash
  npm install -g firebase-tools
  ```
* [Android Studio](https://developer.android.com/studio) (para compilar APK)
* Cuenta en **Supabase** (para URL y keys del proyecto)

---

## 📂 Estructura principal del proyecto

```text
src/
  app/
    app.component.ts
    app.component.html
    app.component.scss
    app.config.ts
    app.routes.ts

    services/
      supabase.service.ts
      auth.service.ts
      readings.service.ts

    guards/
      auth.guard.ts
      admin.guard.ts

    pages/
      auth/
        login.page.ts
        login.page.html
        login.page.scss
        register.page.ts
        register.page.html
        register.page.scss
        forgot-password.page.ts
        update-password.page.ts

      dashboard/
        dashboard.page.ts
        dashboard.page.html
        dashboard.page.scss

      readings/
        new-reading.page.ts
        new-reading.page.html
        new-reading.page.scss
        my-readings.page.ts
        my-readings.page.html
        my-readings.page.scss
        all-readings.page.ts
        all-readings.page.html
        all-readings.page.scss

  environments/
    environment.ts
    environment.prod.ts
```

---

## 🔧 Configuración de entornos (Supabase)

Edita los archivos:

`src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://TU-PROJECT.supabase.co',
  supabaseAnonKey: 'TU_ANON_KEY'
};
```

`src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  supabaseUrl: 'https://TU-PROJECT.supabase.co',
  supabaseAnonKey: 'TU_ANON_KEY'
};
```

> ⚠️ **Nunca** subas las keys privadas de servicio (service role) al frontend.

---

## 🧪 Ejecución en desarrollo

Instala las dependencias:

```bash
npm install
```

Levanta el proyecto con Ionic:

```bash
ionic serve
```

La app se abrirá normalmente en `http://localhost:8100/`.

---

## 🏗️ Build de producción (web)

Genera el build de Angular/Ionic:

```bash
ionic build
```

Esto creará la carpeta `www/` que se usará tanto para Firebase Hosting como para Capacitor (Android).

---

## ☁️ Despliegue en Firebase Hosting

1. **Inicializar Firebase (una sola vez):**

   ```bash
   firebase login
   firebase init hosting
   ```

   * `? What do you want to use as your public directory?` → **www**
   * `? Configure as a single-page app (rewrite all urls to /index.html)?` → **Yes**

2. Verifica que `firebase.json` tenga algo como:

   ```json
   {
     "hosting": {
       "public": "www",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Deploy:**

   ```bash
   ionic build
   firebase deploy
   ```

   Firebase devolverá la URL del sitio, por ejemplo:
   `https://medidor-agua-XXXX.web.app`

---

## 🤖 Build Android (APK) con Capacitor

1. Asegúrate de haber hecho el build:

   ```bash
   ionic build
   ```

2. Sincroniza Capacitor:

   ```bash
   npx cap sync android
   ```

3. Abre el proyecto en Android Studio:

   ```bash
   npx cap open android
   ```

4. Desde Android Studio:

   * Elige **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   * El APK se generará en:
     `android/app/build/outputs/apk/debug/` o `release/`.

---

## 🔐 Permisos de Cámara y Ubicación

La app utiliza:

* `@capacitor/camera`
* `@capacitor/geolocation`

Asegúrate de tenerlos instalados:

```bash
npm install @capacitor/camera @capacitor/geolocation
npx cap sync
```

En Android Studio revisa que se añadan los permisos en `AndroidManifest.xml` (Capacitor los gestiona, pero conviene revisarlo):

* `CAMERA`
* `ACCESS_COARSE_LOCATION`
* `ACCESS_FINE_LOCATION`

---

## 👥 Uso básico

1. El usuario abre la app y ve la **pantalla de login**.
2. Si no tiene cuenta:

   * Accede a **“¿No tienes cuenta? Crear cuenta”** y completa el registro.
3. Una vez autenticado:

   * Accede al **Dashboard**.
4. Para registrar una lectura:

   * Entra a **Nueva lectura**.
   * Toma una foto del medidor (cámara).
   * Guarda la lectura y ubicación.
5. El usuario puede ver:

   * Sus lecturas en **Mis lecturas**.
   * Todas las lecturas en **Todas las lecturas** (si su rol lo permite).

---

## 🧑‍💻 Scripts NPM más usados

```bash
# Desarrollo
ionic serve

# Build producción
ionic build

# Sincronizar Capacitor
npx cap sync android

# Abrir proyecto Android
npx cap open android

# Tests (si están configurados)
npm test
```

---

## 📄 Licencia

Proyecto realizado con fines académicos / demostrativos.
Ajusta esta sección según la licencia que quieras utilizar (MIT, GPL, etc.).

---

```

Si quieres, en el siguiente mensaje podemos armar juntos un pequeño **diagrama de arquitectura** (Front Ionic + Supabase + Firebase Hosting + Android) para ponerlo también en el README.
::contentReference[oaicite:0]{index=0}
```
