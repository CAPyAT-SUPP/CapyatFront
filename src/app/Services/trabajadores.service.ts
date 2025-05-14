import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { Trabajadores } from '../Models/Trabajadores';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Trabajadores";
  private apiZonasUrl: string = appsettings.apiUrl + "Zona";
  private apiAreasUrl: string = appsettings.apiUrl + "Area";
  

  constructor() { }

  // Obtener la lista de Trabajadores
  lista(): Observable<Trabajadores[]> {
    return this.http.get<Trabajadores[]>(this.apiUrl);
  }
  
  // Obtener un Trabajador por su ID
  obtener(IDTrabajador: number): Observable<Trabajadores> {
    return this.http.get<Trabajadores>(`${this.apiUrl}/${IDTrabajador}`);
  }

  // Registrar un nuevo Trabajador
  registrar(objeto: Trabajadores): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, objeto);
  }

  // Editar un Trabajador
  editar(objeto: Trabajadores): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(this.apiUrl, objeto);
  }
  

  // Eliminar un Trabajador
  eliminar(IDTrabajador: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDTrabajador}`);
  }

  // Obtener la lista de Zonas
  obtenerZonas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiZonasUrl);
  }

  // Obtener la lista de Áreas
  obtenerAreas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiAreasUrl);
  }
}
