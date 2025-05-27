// Configuración de OpenTelemetry para trazas
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { metrics } = require('@opentelemetry/api');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// Configuración del logger
const logger = require('./logger');

// Recurso común para identificar el servicio
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'demo-backend',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development'
});

// Configuración del exportador de trazas
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTLP_ENDPOINT || 'http://jaeger:4317',
});

// Configuración del SDK de OpenTelemetry
const sdk = new opentelemetry.NodeSDK({
  resource: resource,
  spanProcessor: new BatchSpanProcessor(traceExporter),
  instrumentations: [getNodeAutoInstrumentations()]
});

// Configuración del exportador de métricas
const metricExporter = new OTLPMetricExporter({
  url: process.env.OTLP_METRICS_ENDPOINT || 'http://prometheus:9090/api/v1/write',
});

// Configuración del proveedor de métricas
const meterProvider = new MeterProvider({
  resource: resource,
});

// Añadir el exportador de métricas
meterProvider.addMetricReader(new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 15000, // Exportar cada 15 segundos
}));

// Establecer el proveedor de métricas global
metrics.setGlobalMeterProvider(meterProvider);

// Iniciar el SDK
try {
  sdk.start();
  logger.info('SDK de OpenTelemetry iniciado');
} catch (error) {
  logger.error(`Error al iniciar SDK de OpenTelemetry: ${error}`);
}

// Manejar el cierre de la aplicación
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => logger.info('SDK de OpenTelemetry detenido'))
    .catch(error => logger.error(`Error al detener SDK de OpenTelemetry: ${error}`))
    .finally(() => process.exit(0));
});

module.exports = sdk;