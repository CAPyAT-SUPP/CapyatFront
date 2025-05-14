import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  correo: string = '';
  clave: string = '';
  errorMessage: string = '';
  animandoLogin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verifica si el usuario ya está autenticado al cargar el componente
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/trabajadores']); // Redirige a la vista de trabajadores si ya está autenticado
    }
  }

  onSubmit() {
    this.authService.login(this.correo, this.clave).subscribe({
      next: (response) => {
        const token = response.token;
        const usuario = response.usuario;
  
        this.authService.setSession(usuario, token);
  
        this.animandoLogin = true; // Mostrar animación
  
        // Esperar 1.5 segundos antes de redirigir
        setTimeout(() => {
          const rol = usuario.nombreRol;
  
          if (rol === 'Administrador' || rol === 'Operativo' || rol === 'Administrativo') {
            this.router.navigate(['/trabajadores']);
          } else {
            this.router.navigate(['/login']);
          }
        }, 2500); // Puedes ajustar el tiempo
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }
  
}
