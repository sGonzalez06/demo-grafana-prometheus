import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TracingService } from '../telemetry/tracing.service';

export interface Item {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'http://localhost:3000/api/items';

  constructor(
    private http: HttpClient,
    private tracingService: TracingService
  ) {}

  // Obtener todos los items
  getItems(): Observable<Item[]> {
    return this.tracingService.createSpan('frontend.getItems', () => {
      return this.http.get<Item[]>(this.apiUrl).pipe(
        tap(items => {
          console.log(`Obtenidos ${items.length} items`);
        })
      );
    }, { 'operation': 'getItems' });
  }

  // Obtener un item por ID
  getItem(id: number): Observable<Item> {
    return this.tracingService.createSpan('frontend.getItem', () => {
      return this.http.get<Item>(`${this.apiUrl}/${id}`).pipe(
        tap(item => {
          console.log(`Obtenido item con ID ${item.id}`);
        })
      );
    }, { 'operation': 'getItem', 'itemId': id });
  }

  // Crear un nuevo item
  createItem(item: Omit<Item, 'id'>): Observable<Item> {
    return this.tracingService.createSpan('frontend.createItem', () => {
      return this.http.post<Item>(this.apiUrl, item).pipe(
        tap(newItem => {
          console.log(`Creado nuevo item con ID ${newItem.id}`);
        })
      );
    }, { 'operation': 'createItem' });
  }

  // Actualizar un item
  updateItem(id: number, item: Omit<Item, 'id'>): Observable<Item> {
    return this.tracingService.createSpan('frontend.updateItem', () => {
      return this.http.put<Item>(`${this.apiUrl}/${id}`, item).pipe(
        tap(updatedItem => {
          console.log(`Actualizado item con ID ${updatedItem.id}`);
        })
      );
    }, { 'operation': 'updateItem', 'itemId': id });
  }

  // Eliminar un item
  deleteItem(id: number): Observable<void> {
    return this.tracingService.createSpan('frontend.deleteItem', () => {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        tap(() => {
          console.log(`Eliminado item con ID ${id}`);
        })
      );
    }, { 'operation': 'deleteItem', 'itemId': id });
  }
}