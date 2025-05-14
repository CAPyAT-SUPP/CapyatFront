import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { ResponseAPI } from '../Models/ResponseAPI';
import { Observable } from 'rxjs';
import { Rol, Usuario, UsuarioRegistro } from '../Models/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "Usuario";

  constructor() { }

  // Obtener lista de usuarios
  lista(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtener un usuario por ID
  obtener(IDUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${IDUsuario}`);
  }

  // Registrar un nuevo usuario
  registrar(usuario: UsuarioRegistro): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, usuario);
  }
  
  // Editar un usuario
  editar(usuario: Usuario): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(this.apiUrl, usuario);
  }

  // Eliminar un usuario
  eliminar(IDUsuario: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${IDUsuario}`);
  }
  
}
