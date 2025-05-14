import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Movimientos } from '../Models/Movimientos';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}Movimientos`;
  private tiposMovimientoUrl = `${appsettings.apiUrl}TiposMovimiento`;

  // 🔹 Obtener lista de movimientos
  obtenerMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Lista`);
  }  

  // 🔹 Obtener un movimiento por ID
  obtener(IDMovimiento: number): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${this.apiUrl}/${IDMovimiento}`);
  }

  // 🔹 Registrar un nuevo movimiento
  registrar(movimiento: Movimientos): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, movimiento);
  }

  // 🔹 Editar un movimiento existente
  editar(movimiento: Movimientos): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(this.apiUrl, movimiento);
  }

  // 🔹 Eliminar un movimiento por ID
  eliminar(IDMovimiento: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDMovimiento}`);
  }

}
