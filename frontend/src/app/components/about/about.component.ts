import { Component, OnInit } from '@angular/core';
import { TracingService } from '../../telemetry/tracing.service';

@Component({
  selector: 'app-about',
  template: `
    <div class="container">
      <h1>Acerca de esta aplicación</h1>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Demo Grafana Prometheus</h5>
          <p class="card-text">
            Esta aplicación de demostración ilustra cómo implementar OpenTelemetry en una aplicación Angular
            para monitorear el rendimiento y la salud de la aplicación utilizando Grafana y Prometheus.
          </p>
          <h6>Características principales:</h6>
          <ul>
            <li>Instrumentación de frontend con OpenTelemetry</li>
            <li>Trazabilidad distribuida entre frontend y backend</li>
            <li>Monitoreo de rendimiento en tiempo real</li>
            <li>Visualización de métricas con Grafana</li>
            <li>Almacenamiento de métricas con Prometheus</li>
          </ul>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">Tecnologías Frontend</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Angular</li>
                <li class="list-group-item">OpenTelemetry JS</li>
                <li class="list-group-item">Bootstrap</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-warning text-dark">
              <h5 class="mb-0">Tecnologías Backend</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Node.js</li>
                <li class="list-group-item">Express</li>
                <li class="list-group-item">OpenTelemetry Node</li>
                <li class="list-group-item">Prometheus</li>
                <li class="list-group-item">Grafana</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .card-header {
      font-weight: 500;
    }
  `]
})
export class AboutComponent implements OnInit {
  constructor(
    private tracingService: TracingService
  ) {}

  ngOnInit(): void {
    this.tracingService.createSpan('about.component.init', () => {
      console.log('AboutComponent inicializado');
    }, { 'component': 'AboutComponent' });
  }
}