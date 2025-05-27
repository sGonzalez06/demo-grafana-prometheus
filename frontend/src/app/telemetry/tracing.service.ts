import { Injectable } from '@angular/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

@Injectable({
  providedIn: 'root'
})
export class TracingService {
  private readonly serviceName = 'demo-frontend';

  constructor() {
    this.initializeTracing();
  }

  private initializeTracing(): void {
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: this.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development'
    });

    // Configurar el exportador de trazas
    const exporter = new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces', // Endpoint OTLP HTTP de Jaeger (no need to change as we're using HTTP port 4318 which is not conflicting)
    });

    // Crear el proveedor de trazas
    const provider = new WebTracerProvider({
      resource: resource
    });

    // Usar BatchSpanProcessor para enviar trazas en lotes
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    // Registrar el proveedor de trazas
    provider.register({
      contextManager: new ZoneContextManager()
    });

    // Registrar instrumentaciones automáticas
    registerInstrumentations({
      instrumentations: [
        // Instrumentación para carga de documentos
        new DocumentLoadInstrumentation(),
        // Instrumentación para solicitudes fetch
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/], // Propagar headers a todos los orígenes
          clearTimingResources: true,
        }),
        // Instrumentación para solicitudes XMLHttpRequest
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/], // Propagar headers a todos los orígenes
        }),
      ],
    });

    console.log('OpenTelemetry inicializado para el frontend');
  }

  // Método para crear un span personalizado
  createSpan(name: string, fn: () => any, attributes: Record<string, any> = {}): any {
    const tracer = trace.getTracer(this.serviceName);
    return tracer.startActiveSpan(name, (span) => {
      try {
        // Añadir atributos al span
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });

        // Ejecutar la función dentro del contexto del span
        const result = fn();
        span.end();
        return result;
      } catch (error) {
        // Registrar el error en el span
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        span.end();
        throw error;
      }
    });
  }

  // Método para obtener el contexto de traza actual
  getCurrentTraceContext(): { traceId: string; spanId: string } | null {
    const span = trace.getActiveSpan();
    if (!span) {
      return null;
    }

    const spanContext = span.spanContext();
    return {
      traceId: spanContext.traceId,
      spanId: spanContext.spanId
    };
  }
}