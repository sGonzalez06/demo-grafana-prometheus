import { Component, OnInit } from '@angular/core';
import { ItemsService, Item } from '../../services/items.service';
import { TracingService } from '../../telemetry/tracing.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <h1>Bienvenido a la Demo de Grafana y Prometheus</h1>
      <p class="lead">Esta aplicación demuestra la integración de OpenTelemetry con Angular para monitoreo con Grafana y Prometheus.</p>
      
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Gestión de Items</h5>
            </div>
            <div class="card-body">
              <p>Puedes crear, ver y gestionar items en esta aplicación.</p>
              <app-item-list></app-item-list>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Crear Nuevo Item</h5>
            </div>
            <div class="card-body">
              <app-item-form></app-item-form>
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
export class HomeComponent implements OnInit {
  constructor(
    private tracingService: TracingService
  ) {}

  ngOnInit(): void {
    this.tracingService.createSpan('home.component.init', () => {
      console.log('HomeComponent inicializado');
    }, { 'component': 'HomeComponent' });
  }
}