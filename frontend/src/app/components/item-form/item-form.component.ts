import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { TracingService } from '../../telemetry/tracing.service';

@Component({
  selector: 'app-item-form',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Crear nuevo item</h5>
        <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" formControlName="name">
            <div *ngIf="itemForm.get('name')?.invalid && itemForm.get('name')?.touched" class="text-danger">
              El nombre es requerido
            </div>
          </div>
          
          <div class="mb-3">
            <label for="description" class="form-label">Descripción</label>
            <textarea class="form-control" id="description" rows="3" formControlName="description"></textarea>
            <div *ngIf="itemForm.get('description')?.invalid && itemForm.get('description')?.touched" class="text-danger">
              La descripción es requerida
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="itemForm.invalid">Guardar</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  `]
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private tracingService: TracingService
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tracingService.createSpan('item-form.component.init', () => {
      console.log('ItemFormComponent inicializado');
    }, { 'component': 'ItemFormComponent' });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.tracingService.createSpan('item-form.submit', () => {
        this.itemsService.createItem(this.itemForm.value).subscribe(
          (newItem) => {
            console.log('Item creado:', newItem);
            this.itemForm.reset();
            alert('Item creado correctamente');
          },
          (error) => {
            console.error('Error al crear item:', error);
            alert('Error al crear el item');
          }
        );
      }, { 'formAction': 'createItem' });
    }
  }
}