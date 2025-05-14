import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../Models/Roles';
import { ResponseAPI } from '../Models/ResponseAPI';
import { appsettings } from '../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Usuario';

  constructor() { }

  // ✅ Obtener lista de roles desde el endpoint correcto
  lista(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/lista-roles`);
  }

  // Obtener un rol por ID
  obtener(idRol: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${idRol}`);
  }
}
