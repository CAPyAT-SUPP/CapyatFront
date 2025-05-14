import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { authInterceptor } from './app/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Agregar las rutas
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Agregar el interceptor aquí
    ),
  ]
}).catch(err => console.error(err));
