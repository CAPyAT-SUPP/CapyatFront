import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrabajadoresService } from '../../Services/trabajadores.service';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-registrar-trabajador',
  templateUrl: './dialog-registrar-trabajador.component.html',
  styleUrls: ['./dialog-registrar-trabajador.component.css'],
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, FormsModule,
    MatDialogActions, MatDialogContent
  ]
})
export class DialogRegistrarTrabajadorComponent implements OnInit {
  
  private trabajadorService = inject(TrabajadoresService);
  nuevoTrabajador = {
    NombreTrabajador: '',
    IDZona: '',
    IDArea: ''
  };

  zonas: any[] = [];
  areas: any[] = [];

  constructor(private dialogRef: MatDialogRef<DialogRegistrarTrabajadorComponent>) {}

  ngOnInit() {
    this.trabajadorService.obtenerZonas().subscribe({
      next: (data) => this.zonas = data,
      error: (err) => console.error("Error al obtener zonas:", err)
    });

    this.trabajadorService.obtenerAreas().subscribe({
      next: (data) => this.areas = data,
      error: (err) => console.error("Error al obtener áreas:", err)
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

  registrar() {
    console.log("🔹 Datos a enviar:", this.nuevoTrabajador);
  
    this.trabajadorService.registrar(this.nuevoTrabajador).subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess) {
          console.log("Registro exitoso:", respuesta);
          this.dialogRef.close(true); // Cerrar y actualizar la tabla
        } else {
          console.error("Error en el registro:", respuesta);
        }
      },
      error: (err) => {
        console.error("Error al enviar la solicitud:", err);
      }
    });
  }
  
}


