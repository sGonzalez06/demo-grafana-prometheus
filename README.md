# Guía de Telemetría y Observabilidad: Demo Grafana & Prometheus

Este repositorio contiene una implementación de referencia diseñada para el estudio de sistemas de observabilidad modernos. El proyecto demuestra la integración de una arquitectura web (Frontend Angular y Backend Node.js) con un stack de telemetría basado en estándares abiertos (OpenTelemetry).

## Fundamentos del Proyecto

### ¿Por qué Observabilidad?
En el contexto de sistemas distribuidos, la **observabilidad** es la medida de qué tan bien se puede entender el estado interno de un sistema a partir de los datos que genera (salidas). A diferencia del monitoreo tradicional, que se enfoca en "qué está fallando", la observabilidad permite entender "por qué está fallando" mediante la correlación de datos.

### Las Tres vías de DevOps y Telemetría
Este proyecto se alinea con los principios fundamentales de DevOps:

1.  **La Primera Vía (Flujo)**: La telemetría permite visualizar el flujo de valor desde el desarrollo hasta la operación, identificando cuellos de botella en la infraestructura y la lógica de negocio.
2.  **La Segunda Vía (Retroalimentación)**: Los dashboards y alertas proporcionan ciclos de retroalimentación rápidos. Al observar el comportamiento en tiempo real, se pueden corregir errores antes de que afecten a la totalidad de los usuarios.
3.  **La Tercera Vía (Aprendizaje Continuo)**: El análisis de trazas históricas y logs permite realizar experimentos controlados y aprender de las fallas (post-mortems), fomentando una cultura de mejora constante.

## Arquitectura del Sistema

El sistema se organiza en capas para facilitar su comprensión y escalabilidad:

1.  **ßAplicación**:
    *   **Frontend (Angular)**: Interfaz de usuario que genera eventos de navegación y peticiones asíncronas.
    *   **Backend (Node.js/Express)**: API que procesa la lógica y gestiona los datos.
2.  **ßInstrumentación (OpenTelemetry)**:
    *   Actúa como un estándar neutral que recolecta **Métricas, Trazas y Logs**. Al usar OpenTelemetry, se evita el "vendor lock-in", permitiendo cambiar el sistema de almacenamiento sin modificar el código de la aplicación.
3.  **ßAlmacenamiento y Visualización**:
    *   **Prometheus**: Base de datos de series temporales optimizada para métricas.
    *   **Jaeger**: Motor de búsqueda y visualización de trazas distribuidas para entender el camino de una petición.
    *   **Loki**: Sistema de agregación de logs que utiliza las mismas etiquetas que Prometheus, facilitando la correlación.
    *   **Grafana**: Orquestador visual que unifica todas las fuentes de datos en una sola interfaz.

## Distribución de Datos y Latencia

En la telemetría de rendimiento, el uso de promedios aritméticos suele ser engañoso para la toma de decisiones. Este proyecto implementa **Histogramas** para capturar la distribución real de la latencia.

### El Riesgo del promedio aritmético
Supongamos que un servicio recibe 10 solicitudes:
*   9 solicitudes tardan **100ms**.
*   1 solicitud tarda **5000ms** (5 segundos) debido a un bloqueo en la base de datos.

El **promedio aritmético** sería: `(9 * 100 + 5000) / 10 = 590ms`.
*   El promedio de 590ms no representa a ninguno de los dos grupos. Para el 90% de los usuarios el sistema es rapidísimo, mientras que para el 10% es inaceptablemente lento. Un administrador podría pensar que "todo va un poco lento" y optimizar el código general, cuando el problema real es un caso de borde (edge case) que requiere una solución específica.

### Conceptos Estadísticos Aplicados
*   **Distribución de "Cola Larga"**: El tráfico web no suele seguir una distribución normal. Frecuentemente presenta una cola larga donde una pequeña fracción de usuarios experimenta latencias desproporcionadamente altas.
*   **Percentiles (p50, p90, p99)**:
    *   **p50 (Mediana)**: El tiempo que experimenta el usuario típico (en el ejemplo anterior, sería 100ms).
    *   **p99**: El tiempo que experimenta el 1% de los usuarios con peor rendimiento. Es crítico para identificar problemas de infraestructura.
*   **Buckets de Histograma**: Prometheus almacena las métricas en "baldes" de rangos de tiempo. Esto permite calcular percentiles de forma eficiente sin necesidad de procesar cada petición individual en tiempo real.

## Dashboard

El dashboard de Grafana (`Demo App Dashboard`) permite ver:

*   **Solicitudes HTTP por Endpoint**: Visualiza el volumen de tráfico distribuido por rutas.
*   **Latencia de Respuesta (p95)**: Muestra el tiempo de respuesta para el 95% de las solicitudes, eliminando el ruido de los promedios.
*   **Total de Solicitudes y Errores**: Indicadores clave (KPIs) sobre la salud inmediata del sistema.
*   **Distribución de Códigos de Estado**: Gráfico de torta que permite identificar rápidamente la proporción de éxitos (2xx) vs errores (4xx, 5xx).
*   **Uso de Memoria**: Monitor de recursos del proceso Node.js (Resident Set Size).

## Componentes

| Componente | Justificación Técnica |
| :--- | :--- |
| **Prometheus** | Utiliza un modelo de "pull" (recolección activa), lo que protege al sistema de monitoreo de ser inundado por datos si la aplicación falla. |
| **Jaeger** | Permite realizar el seguimiento de una solicitud desde el navegador hasta la base de datos, asignando un `traceID` único que viaja a través de los headers HTTP. |
| **Loki** | A diferencia de otros sistemas, no indexa el contenido del log, sino las etiquetas (metadata). Esto reduce drásticamente el uso de memoria y disco. |
| **OpenTelemetry SDK** | Proporciona instrumentación automática para librerías comunes (como Express o Fetch), reduciendo el esfuerzo manual del desarrollador. |

## Ejecución

### Despliegue
1.  **Iniciar servicios**:
    ```bash
    docker-compose up -d
    ```
2.  **Acceso a interfaces**:
    *   **App**: [http://localhost:4200](http://localhost:4200)
    *   **Grafana**: [http://localhost:3001](http://localhost:3001) (Credenciales: `admin`/`admin`)
    *   **Jaeger**: [http://localhost:16686](http://localhost:16686)

### Generación de telemetria

1.  Navegar entre secciones para generar trazas de carga de página.
2.  Crear y eliminar elementos para observar métricas de operaciones de negocio.
3.  Acceder a la ruta de error ([http://localhost:3000/error](http://localhost:3000/error)) para visualizar cómo se reportan las excepciones en los logs y trazas de forma correlacionada.

## Retroalimentación y Mejora
El análisis de estos datos permite implementar una cultura de **SRE (Site Reliability Engineering)**, definiendo SLOs basados en los datos reales recolectados por este stack.
