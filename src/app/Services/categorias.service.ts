import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { Categorias } from '../Models/Categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Categorias";

  constructor() { }

      lista(): Observable<Categorias[]> {
        return this.http.get<Categorias[]>(this.apiUrl);
      }
      
      // Obtener una Material por su ID
      obtener(IDCategoria: number): Observable<Categorias> {
        return this.http.get<Categorias>(`${this.apiUrl}/${IDCategoria}`);
      }
    
      // Registrar un nuevo Material
      registrar(objeto: Categorias): Observable<ResponseAPI> {
        return this.http.post<ResponseAPI>(this.apiUrl, objeto);
      }
    
      // Editar un material
      editar(objeto: Categorias): Observable<ResponseAPI> {
        return this.http.put<ResponseAPI>(this.apiUrl, objeto);
      }
      
      // Eliminar un material
      eliminar(IDCategoria: number): Observable<ResponseAPI> {
        return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDCategoria}`);
      }
}
