# Home Scheduler

**Home Scheduler** es una aplicación para la gestión de tareas del hogar, diseñada para ayudarte a organizar y planificar tus tareas personales, profesionales y del hogar de manera eficiente.

## Configuración Inicial

Para empezar a utilizar esta aplicación, sigue estos pasos:

### 1. Clona el Repositorio

Clona este repositorio en tu máquina local utilizando el siguiente comando:

```bash
git clone https://github.com/tu-usuario/home-scheduler.git
```

### 2. Instala las Dependencias

Navega al directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
cd home-scheduler
npm install
```

### 3. Configuración de Variables de Entorno

Debes configurar las variables de entorno para conectarte con Firebase. Crea un archivo `.env.local` en la raíz del proyecto y agrega las siguientes configuraciones:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=<TU_API_KEY>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<TU_AUTH_DOMAIN>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<TU_PROJECT_ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<TU_STORAGE_BUCKET>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<TU_MESSAGING_SENDER_ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<TU_APP_ID>
```

**Nota:** Asegúrate de reemplazar los valores con tus credenciales de Firebase. Puedes obtener esta información desde el [Firebase Console](https://console.firebase.google.com/).

### 4. Inicia la Aplicación

Una vez configuradas las variables de entorno y instaladas las dependencias, puedes iniciar la aplicación en modo de desarrollo utilizando el siguiente comando:

```bash
npm run dev
```

Esto abrirá la aplicación en tu navegador en [http://localhost:3000](http://localhost:3000).

### 5. Compilación para Producción

Para preparar la aplicación para producción, utiliza el comando:

```bash
npm run build
```

Esto generará una versión optimizada de tu aplicación en la carpeta `out`.

## Tecnologías Utilizadas

-   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
-   **Next.js**: Framework de React para aplicaciones web de lado del servidor.
-   **Firebase**: Plataforma para aplicaciones web y móviles que ofrece servicios de backend como autenticación, base de datos en tiempo real y almacenamiento.
-   **Redux**: Librería para la gestión del estado de la aplicación.
-   **Material-UI**: Librería de componentes de interfaz de usuario basados en Material Design para React.

## Funcionalidades Principales

-   **Gestión de Tareas**: Añadir, editar, y eliminar tareas personales, profesionales y del hogar.
-   **Autenticación**: Sistema de autenticación de usuarios utilizando Firebase Auth.
-   **Recurrencia de Tareas**: Configuración de tareas recurrentes (diarias, semanales, mensuales).
-   **Vista Personalizada**: Visualización de tareas en vistas diarias, semanales y mensuales.

## Contribución

¡Las contribuciones son bienvenidas! Si tienes alguna sugerencia, corrección o mejora, no dudes en abrir un issue o enviar un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.
