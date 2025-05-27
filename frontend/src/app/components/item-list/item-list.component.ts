import { Component, OnInit } from '@angular/core';
import { ItemsService, Item } from '../../services/items.service';
import { TracingService } from '../../telemetry/tracing.service';

@Component({
  selector: 'app-item-list',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Lista de Items</h5>
        
        <div *ngIf="loading" class="text-center my-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        
        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div *ngIf="!loading && !error && items.length === 0" class="alert alert-info">
          No hay items disponibles. ¡Crea uno nuevo!
        </div>
        
        <ul *ngIf="!loading && items.length > 0" class="list-group">
          <li *ngFor="let item of items" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-0">{{ item.name }}</h6>
              <small>{{ item.description }}</small>
            </div>
            <div>
              <button class="btn btn-sm btn-danger" (click)="deleteItem(item.id)">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </li>
        </ul>
        
        <button class="btn btn-primary mt-3" (click)="loadItems()">
          <i class="bi bi-arrow-clockwise"></i> Recargar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .list-group-item {
      transition: background-color 0.2s;
    }
    .list-group-item:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(
    private itemsService: ItemsService,
    private tracingService: TracingService
  ) {}

  ngOnInit(): void {
    this.tracingService.createSpan('item-list.component.init', () => {
      console.log('ItemListComponent inicializado');
      this.loadItems();
    }, { 'component': 'ItemListComponent' });
  }

  loadItems(): void {
    this.loading = true;
    this.error = null;
    
    this.tracingService.createSpan('item-list.load-items', () => {
      this.itemsService.getItems().subscribe(
        (items) => {
          this.items = items;
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar items:', error);
          this.error = 'Error al cargar los items. Por favor, intenta de nuevo.';
          this.loading = false;
        }
      );
    }, { 'action': 'loadItems' });
  }

  deleteItem(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
      this.tracingService.createSpan('item-list.delete-item', () => {
        this.itemsService.deleteItem(id).subscribe(
          () => {
            console.log('Item eliminado correctamente');
            this.items = this.items.filter(item => item.id !== id);
          },
          (error) => {
            console.error('Error al eliminar item:', error);
            alert('Error al eliminar el item');
          }
        );
      }, { 'action': 'deleteItem', 'itemId': id });
    }
  }
}