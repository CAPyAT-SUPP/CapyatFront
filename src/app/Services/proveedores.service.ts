import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { Proveedores } from '../Models/Proveedores';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Proveedores";


  constructor() { }
  
    lista(): Observable<Proveedores[]> {
      return this.http.get<Proveedores[]>(this.apiUrl);
    }
    
    // Obtener una Material por su ID
    obtener(IDProveedores: number): Observable<Proveedores> {
      return this.http.get<Proveedores>(`${this.apiUrl}/${IDProveedores}`);
    }
  
    // Registrar un nuevo Material
    registrar(objeto: Proveedores): Observable<ResponseAPI> {
      return this.http.post<ResponseAPI>(this.apiUrl, objeto);
    }
  
    // Editar un material
    editar(objeto: Proveedores): Observable<ResponseAPI> {
      return this.http.put<ResponseAPI>(this.apiUrl, objeto);
    }
    
    // Eliminar un material
    eliminar(IDProveedores: number): Observable<ResponseAPI> {
      return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDProveedores}`);
    }
  }
  
