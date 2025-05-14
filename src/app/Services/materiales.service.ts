import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { Materiales } from '../Models/Materiales';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Materiales";
  private categoriasUrl: string = appsettings.apiUrl + "Categorias";
  private proveedoresUrl: string = appsettings.apiUrl + "Proveedores";

  constructor() { }

  // **🔹 Obtener lista de materiales**
  lista(): Observable<Materiales[]> {
    return this.http.get<Materiales[]>(this.apiUrl);
  }

  // **🔹 Obtener un material por su ID**
  obtener(IDMateriales: number): Observable<Materiales> {
    return this.http.get<Materiales>(`${this.apiUrl}/${IDMateriales}`);
  }

  // **🔹 Registrar un nuevo material**
  registrar(objeto: Materiales): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, objeto);
  }

  // **🔹 Editar un material**
  editar(objeto: Materiales): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(this.apiUrl, objeto);
  }

  // **🔹 Eliminar un material**
  eliminar(IDMateriales: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDMateriales}`);
  }

  // **🔹 Obtener lista de categorías**
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriasUrl);
  }

  // **🔹 Obtener lista de proveedores**
  obtenerProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.proveedoresUrl);
  }
}
