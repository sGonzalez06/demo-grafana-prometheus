# Frontend - Demo Grafana Prometheus

Este directorio contiene la aplicación frontend desarrollada con Angular para la demostración de monitoreo con Grafana y Prometheus.

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/       # Componentes de la aplicación
│   │   │   ├── about/        # Página Acerca de
│   │   │   ├── contact/      # Página de Contacto
│   │   │   ├── home/         # Página de Inicio
│   │   │   ├── item-form/    # Formulario para crear items
│   │   │   └── item-list/    # Lista de items
│   │   ├── services/         # Servicios para comunicación con API
│   │   │   └── items.service.ts
│   │   ├── telemetry/        # Configuración de OpenTelemetry
│   │   │   └── tracing.service.ts
│   │   ├── app.component.ts  # Componente principal
│   │   └── app.module.ts     # Módulo principal
│   ├── assets/               # Recursos estáticos
│   ├── index.html            # Página HTML principal
│   ├── main.ts               # Punto de entrada de la aplicación
│   └── styles.css            # Estilos globales
├── angular.json              # Configuración de Angular
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
├── tsconfig.app.json         # Configuración TS para la aplicación
├── tsconfig.spec.json        # Configuración TS para pruebas
└── Dockerfile                # Configuración para Docker
```

## Características

- **Interfaz de Usuario Moderna**: Desarrollada con Angular y Bootstrap para una experiencia de usuario responsiva.
- **Gestión de Items**: Creación, visualización y eliminación de items a través de una API REST.
- **Trazabilidad con OpenTelemetry**: Instrumentación completa para monitoreo de rendimiento y seguimiento de operaciones.
- **Formularios Reactivos**: Validación de formularios en tiempo real.
- **Enrutamiento**: Navegación entre diferentes vistas de la aplicación.

## Integración con OpenTelemetry

La aplicación está instrumentada con OpenTelemetry para proporcionar trazabilidad de las interacciones del usuario y las llamadas a la API. Esto permite:

- Seguimiento de carga de página
- Monitoreo de solicitudes HTTP
- Trazas personalizadas para operaciones específicas
- Propagación de contexto entre frontend y backend

## Ejecución Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

## Construcción para Producción

```bash
# Construir la aplicación
npm run build
```

Los archivos de distribución se generarán en el directorio `dist/`.

## Ejecución con Docker

```bash
# Construir la imagen
docker build -t demo-frontend .

# Ejecutar el contenedor
docker run -p 80:80 demo-frontend
```

La aplicación estará disponible en `http://localhost:80`.