// Configuración de OpenTelemetry - debe ser importado antes que cualquier otra cosa
require('./telemetry/tracer');

const express = require('express');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const logger = require('./telemetry/logger');
const itemsRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para métricas de Prometheus
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { app: 'demo-backend' },
  promClient: {
    collectDefaultMetrics: {}
  }
});

// Middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

// Logging de solicitudes
app.use((req, res, next) => {
  logger.info({
    msg: 'Solicitud recibida',
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
});

// Rutas
app.use('/api/items', itemsRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  logger.info('Verificación de salud realizada');
  res.status(200).json({ status: 'UP' });
});

// Ruta para simular error
app.get('/error', (req, res) => {
  logger.error('Error simulado activado por el usuario');
  res.status(500).json({ error: 'Error simulado' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  logger.error({
    msg: 'Error en la aplicación',
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado en puerto ${PORT}`);
});