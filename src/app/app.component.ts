import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from './Services/Auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GInventario';
  isLoginPage = false;
  currentUserName: string = 'Usuario';
  userRole: string = '';

  constructor(public authService: AuthService, private router: Router) {
    this.updateLayoutVisibility(this.router.url);
    this.setUserInfoFromToken();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateLayoutVisibility(event.urlAfterRedirects);
        this.setUserInfoFromToken();
      });
  }

  private updateLayoutVisibility(url: string): void {
    this.isLoginPage = url.startsWith('/login');
  }

  private setUserInfoFromToken(): void {
    const dataString = localStorage.getItem('user_data');
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        this.currentUserName = data.usuario?.nombreUs || 'Usuario';
        this.userRole = data.usuario?.nombreRol || '';
      } catch (error) {
        console.error('Error leyendo user_data:', error);
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  currentYear = new Date().getFullYear();
}
