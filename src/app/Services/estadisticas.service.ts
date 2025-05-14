import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private http = inject(HttpClient);
  private apiUrl = appsettings.apiUrl + 'Estadistica';

  constructor() { }

  // 🔹 Costo total del inventario
  obtenerCostoTotalInventario(): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/CostoTotalInventario`);
  }

  // 🔹 Entradas y salidas por periodo
  obtenerMovimientosPorPeriodo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/MovimientosPorPeriodo`);
  }

  // 🔹 Costo total por almacén
  obtenerCostoTotalPorAlmacen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/CostoTotalPorAlmacen`);
  }

  // 🔹 Total de materiales por almacén
  obtenerTotalMaterialesPorAlmacen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/TotalMaterialesPorAlmacen`);
  }

  // 🔹 Entradas entre fechas
  entradasEntreFechas(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EntradasEntreFechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
