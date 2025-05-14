import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // ✅ Asegúrate de tener tap aquí
import { appsettings } from '../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + "login";

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() { }

  login(correo: string, clave: string) {
    return this.http.post<any>(this.apiUrl, { correo, clave })
      .pipe(
        tap((response) => {
          const { token, usuario } = response;

          // Guarda en localStorage
          localStorage.setItem('access_token', token);
          localStorage.setItem('user_data', JSON.stringify({ usuario }));
          localStorage.setItem('user_role', usuario.nombreRol);

          this.currentUserSubject.next(usuario);
        }),
        catchError(err => {
          throw err;
        })
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  setSession(user: any, token: string) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', user.nombreRol);
    this.currentUserSubject.next(user);
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
