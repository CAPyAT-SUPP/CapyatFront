import { Routes } from '@angular/router';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { TrabajadoresComponent } from './Pages/trabajadores/trabajadores.component';
import { CategoriasComponent } from './Pages/categorias/categorias.component';
import { MaterialesComponent } from './Pages/materiales/materiales.component';
import { ProveedoresComponent } from './Pages/proveedores/proveedores.component';
import { MovimientosComponent } from './Pages/movimientos/movimientos.component';
import { LoginComponent } from './Pages/login/login.component';
import { EstadisticasComponent } from './Pages/estadisticas/estadisticas.component';
import { AuthGuard } from './guards/auth.guard';  // Asegúrate de que la ruta sea correcta
import { UsuariosComponent } from './Pages/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', component: InicioComponent, canActivate: [AuthGuard] },  // Ruta protegida por AuthGuard
  { path: 'login', component: LoginComponent },  // Ruta del login sin protección
  { path: 'trabajadores', component: TrabajadoresComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'materiales', component: MaterialesComponent, canActivate: [AuthGuard] },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [AuthGuard] },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [AuthGuard] },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }  // Redirige al login si la ruta no existe
];
