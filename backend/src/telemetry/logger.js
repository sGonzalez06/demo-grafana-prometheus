// Sistema de logging estructurado con Pino
const pino = require('pino');
const { trace, context } = require('@opentelemetry/api');

// Configuración de Pino con niveles de logging según requisitos
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  // Añadir información de trazas a cada log
  mixin() {
    const span = trace.getActiveSpan();
    if (span) {
      const { traceId, spanId } = span.spanContext();
      return { traceId, spanId };
    }
    return {};
  },
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
});

// Documentación de los niveles de logging implementados:
// - DEBUG: Información detallada para depuración (deshabilitado en producción)
// - INFO: Acciones impulsadas por el usuario o específicas del sistema
// - WARN: Condiciones que podrían convertirse en un error
// - ERROR: Condiciones de error
// - FATAL: El sistema debe terminar

// Ejemplos de uso:
// logger.debug({ userId: '123' }, 'Detalles de depuración');
// logger.info({ transactionId: 'abc' }, 'Iniciando transacción');
// logger.warn({ dbLatency: 500 }, 'Latencia de base de datos alta');
// logger.error({ err }, 'Error al procesar solicitud');
// logger.fatal({ err }, 'Error crítico, terminando aplicación');

module.exports = logger;