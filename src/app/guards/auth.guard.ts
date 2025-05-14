import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/Auth.service';  // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      return true;  // Si está autenticado, permite el acceso
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Guarda la URL para redirigir después de iniciar sesión
      return false;
    }
  }
}
