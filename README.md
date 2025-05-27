# Demo de Telemetría con Grafana y Prometheus

Este proyecto es una demostración de una aplicación web instrumentada con OpenTelemetry para monitoreo completo usando Prometheus, Grafana, Jaeger y Loki. Incluye un frontend en Angular, un backend en Node.js/Express, y una configuración completa de monitoreo.

## Arquitectura

La arquitectura del proyecto está basada en microservicios y sigue las mejores prácticas de observabilidad, implementando los tres pilares fundamentales: métricas, trazas y logs.

![Arquitectura](https://miro.medium.com/v2/resize:fit:1400/1*Vth3UENwIf4bQRgNVEGgug.png)

La arquitectura se compone de:

1. **Capa de Aplicación**:
   - Frontend en Angular que se comunica con el backend mediante API REST
   - Backend en Node.js/Express que proporciona endpoints para gestionar recursos

2. **Capa de Instrumentación**:
   - OpenTelemetry SDK integrado tanto en frontend como en backend
   - Exportadores configurados para enviar telemetría a los sistemas correspondientes

3. **Capa de Observabilidad**:
   - Prometheus para recolección y almacenamiento de métricas
   - Jaeger para trazas distribuidas
   - Loki para gestión centralizada de logs
   - Grafana para visualización unificada de todos los datos

## Componentes Utilizados

### Frontend
- **Angular**: Framework para la interfaz de usuario
- **OpenTelemetry Web SDK**: Instrumentación del lado del cliente
- **Instrumentaciones automáticas**: Para document-load, fetch y XMLHttpRequest

### Backend
- **Node.js/Express**: Framework para la API REST
- **OpenTelemetry Node SDK**: Instrumentación del lado del servidor
- **Pino**: Sistema de logging estructurado
- **Express Prometheus Bundle**: Middleware para exposición de métricas

### Monitoreo
- **Prometheus**: Sistema de monitoreo y alerta
- **Grafana**: Plataforma de visualización y análisis
- **Jaeger**: Sistema de trazabilidad distribuida
- **Loki**: Sistema de agregación de logs

## Tecnologías y su Rol

| Tecnología | Rol |
|------------|-----|
| **Angular** | Framework frontend que proporciona una SPA (Single Page Application) con enrutamiento y gestión de estado |
| **Node.js/Express** | Entorno de ejecución y framework para el backend que maneja las solicitudes HTTP y la lógica de negocio |
| **OpenTelemetry** | Framework de instrumentación que proporciona una API estándar para recopilar datos de telemetría (métricas, trazas y logs) |
| **Prometheus** | Sistema de monitoreo que recopila y almacena métricas como series temporales, permitiendo consultas y alertas |
| **Grafana** | Plataforma de visualización que permite crear dashboards personalizados para métricas, trazas y logs |
| **Jaeger** | Sistema de trazabilidad distribuida que ayuda a monitorear y solucionar problemas en arquitecturas de microservicios |
| **Loki** | Sistema de agregación de logs inspirado en Prometheus, diseñado para ser costo-efectivo y fácil de operar |
| **Docker** | Plataforma de contenedores que facilita el despliegue y la ejecución de los servicios en entornos aislados |

## Instrucciones para Levantar la Demo

### Requisitos Previos

- Docker y Docker Compose
- Node.js (versión 14 o superior)
- Angular CLI (versión 15 o superior)

### Pasos para Ejecutar

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/yourusername/demo-grafana-prometheus.git
   cd demo-grafana-prometheus
   ```

2. **Iniciar todos los servicios con Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Acceder a las interfaces**:
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:3000
   - **Grafana**: http://localhost:3001 (usuario: admin, contraseña: admin)
   - **Prometheus**: http://localhost:9090
   - **Jaeger UI**: http://localhost:16686

### Consideraciones Importantes

1. **Puertos**: Asegúrate de que los puertos 3000, 3001, 4200, 9090, 16686 y 3100 estén disponibles en tu sistema.

2. **Tiempo de inicialización**: Los servicios pueden tardar unos segundos en estar completamente operativos después de iniciar los contenedores.

3. **Generación de datos**: Para ver datos significativos en los dashboards, interactúa con la aplicación realizando varias acciones como:
   - Navegar entre las diferentes páginas del frontend
   - Crear, actualizar y eliminar items a través del formulario
   - Probar el endpoint de error: http://localhost:3000/error

4. **Persistencia**: Los datos de Prometheus y Grafana se almacenan en volúmenes de Docker para persistir entre reinicios.

5. **Troubleshooting**:
   - Si algún servicio no responde, verifica los logs con `docker-compose logs [servicio]`
   - Para reiniciar un servicio específico: `docker-compose restart [servicio]`
   - Para detener todos los servicios: `docker-compose down`

## Dashboards de Grafana

Este proyecto incluye dashboards predefinidos para Grafana que muestran:

- Métricas de negocio (transacciones, usuarios activos)
- Métricas de aplicación (latencia, errores HTTP)
- Métricas de infraestructura (CPU, memoria, disco, red)
- Visualización de trazas y logs correlacionados
