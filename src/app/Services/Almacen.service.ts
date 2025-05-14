import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';  // Asegúrate de tener este archivo correctamente configurado
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { Almacen } from '../Models/Almacen';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Almacen";  // Asegúrate de que la API esté configurada correctamente

  constructor() { }

  // Obtener la lista de almacenes
  lista(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  // Obtener un Almacén por su ID
  obtener(IDAlmacen: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}/${IDAlmacen}`);
  }

  // Registrar un nuevo Almacén
  registrar(objeto: Almacen): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, objeto);
  }

  // Editar un Almacén
  editar(objeto: Almacen): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(this.apiUrl, objeto);
  }

  // Eliminar un Almacén
  eliminar(IDAlmacen: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDAlmacen}`);
  }
}
