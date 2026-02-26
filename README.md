
# Frontend

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 21.1.5.

## ¿Cómo correr el proyecto?

1. Instala las dependencias:
	```bash
	npm install
	```
2. Inicia el servidor de desarrollo:
	```bash
	npm start
	```
3. Abre tu navegador en `http://localhost:4200/`.

El sistema recargará automáticamente al modificar los archivos fuente.

## Estructura del proyecto y flujo

La estructura del frontend está organizada de la siguiente manera:

```
Frontend/
├── angular.json            # Configuración principal de Angular
├── package.json            # Dependencias y scripts
├── proxy.conf.json         # Proxy para llamadas a backend
├── tsconfig*.json          # Configuración de TypeScript
├── public/                 # Archivos públicos
├── src/
│   ├── index.html          # HTML principal
│   ├── main.ts             # Bootstrap de la app
│   ├── main.server.ts      # Bootstrap para SSR
│   ├── server.ts           # Configuración para SSR
│   ├── styles.scss         # Estilos globales
│   ├── app/
│   │   ├── app.ts          # Componente raíz
│   │   ├── app.html        # Plantilla del componente raíz
│   │   ├── app.scss        # Estilos del componente raíz
│   │   ├── app.routes.ts   # Rutas principales
│   │   ├── app.config.ts   # Configuración de la app
│   │   ├── components/
│   │   │   └── navbar/     # Componente de navegación
│   │   ├── models/         # Modelos de datos (ej. country.model.ts)
│   │   ├── pages/          # Páginas principales
│   │   │   ├── Home/       # Página de inicio
│   │   │   ├── AboutMe/    # Página de información personal
│   │   │   ├── Contries/   # Página de países y modal
│   │   ├── services/       # Servicios para consumo de APIs
│   ├── environments/       # Configuración de entornos
│   ├── styles/             # Estilos globales y utilitarios
```

### Explicación de carpetas y subcarpetas

- **app/**: Contiene el núcleo de la aplicación, componentes, modelos, páginas y servicios.
  - **components/**: Componentes reutilizables (ejemplo: navbar).
  - **models/**: Definición de interfaces y modelos de datos.
  - **pages/**: Vistas principales del sistema (Home, AboutMe, Contries).
  - **services/**: Servicios para interacción con APIs y lógica de negocio.
- **environments/**: Configuración para distintos entornos (desarrollo, producción).
- **styles/**: Archivos Sass para variables, mixins, animaciones y estilos globales.
- **public/**: Archivos estáticos accesibles públicamente.

### Flujo del frontend

1. El usuario ingresa a la aplicación y navega por las páginas principales.
2. Los servicios gestionan la obtención de datos desde el backend (vía REST o GraphQL).
3. Los modelos estructuran los datos recibidos.
4. Los componentes y páginas muestran la información y permiten interacción (ejemplo: modal de países, exportación a PDF).
5. Los estilos y animaciones mejoran la experiencia visual.

## Mejoras que pueden integrarse

- **Internacionalización (i18n)**: Soporte multilenguaje para la interfaz.
- **Mejoras visuales**: Añadir animaciones, temas personalizados y accesibilidad.
- **Optimización de rendimiento**: Lazy loading de módulos y componentes.
- **Gestión de usuarios**: Autenticación y autorización.
- **Exportación de datos**: Mejorar la exportación a CSV/Excel, asi como añadir un formato al PDF.
- **Logs y monitoreo**: Integrar servicios de logging y monitoreo.