import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mt-4">
      <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div class="container-fluid">
          <a class="navbar-brand" routerLink="/">Demo Grafana Prometheus</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/about" routerLinkActive="active">Acerca de</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/contact" routerLinkActive="active">Contacto</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      border-radius: 4px;
    }
    .active {
      font-weight: bold;
    }
  `]
})
export class AppComponent {
  title = 'Demo Grafana Prometheus';
}