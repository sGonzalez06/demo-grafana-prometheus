import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TracingService } from '../../telemetry/tracing.service';

@Component({
  selector: 'app-contact',
  template: `
    <div class="container">
      <h1>Contacto</h1>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Envíanos un mensaje</h5>
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="name" formControlName="name">
                  <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" class="text-danger">
                    El nombre es requerido
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" formControlName="email">
                  <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="text-danger">
                    Email inválido
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="message" class="form-label">Mensaje</label>
                  <textarea class="form-control" id="message" rows="5" formControlName="message"></textarea>
                  <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="text-danger">
                    El mensaje es requerido
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary" [disabled]="contactForm.invalid">Enviar</button>
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Información de contacto</h5>
              <p><strong>Email:</strong> info@demo-grafana-prometheus.com</p>
              <p><strong>Teléfono:</strong> +34 123 456 789</p>
              <p><strong>Dirección:</strong> Calle Ejemplo 123, Madrid, España</p>
              
              <h6 class="mt-4">Horario de atención:</h6>
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
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
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private tracingService: TracingService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tracingService.createSpan('contact.component.init', () => {
      console.log('ContactComponent inicializado');
    }, { 'component': 'ContactComponent' });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.tracingService.createSpan('contact.form.submit', () => {
        console.log('Formulario enviado:', this.contactForm.value);
        // Aquí iría la lógica para enviar el formulario
        alert('Mensaje enviado correctamente');
        this.contactForm.reset();
      }, { 'formAction': 'submit' });
    }
  }
}