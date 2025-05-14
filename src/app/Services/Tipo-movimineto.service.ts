import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';  // Asegúrate de tener este archivo correctamente configurado
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { TipoMovimiento } from '../Models/TipoMovimiento';

@Injectable({
  providedIn: 'root'
})
export class TipoMovimientoService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "TipoMovimiento";  // Asegúrate de que la API esté configurada correctamente

  constructor() { }

  // Obtener la lista de tipos de movimiento
  lista(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(this.apiUrl);
  }

  // Obtener un Tipo de Movimiento por su ID
  obtener(IDTipoMovimiento: number): Observable<TipoMovimiento> {
    return this.http.get<TipoMovimiento>(`${this.apiUrl}/${IDTipoMovimiento}`);
  }

  // Registrar un nuevo Tipo de Movimiento
  registrar(objeto: TipoMovimiento): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, objeto);
  }

  // Editar un Tipo de Movimiento
  editar(objeto: TipoMovimiento): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(this.apiUrl, objeto);
  }

  // Eliminar un Tipo de Movimiento
  eliminar(IDTipoMovimiento: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDTipoMovimiento}`);
  }
}
