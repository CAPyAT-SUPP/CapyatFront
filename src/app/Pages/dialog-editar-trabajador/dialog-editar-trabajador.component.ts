import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrabajadoresService } from '../../Services/trabajadores.service';
import { Trabajadores } from '../../Models/Trabajadores';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-editar-trabajador',
  standalone: true,
  templateUrl: './dialog-editar-trabajador.component.html',
  styleUrl: './dialog-editar-trabajador.component.css',
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatSelectModule, MatDialogContent, MatDialogActions
  ]
})
export class DialogEditarTrabajadorComponent implements OnInit {
  private trabajadorService = inject(TrabajadoresService);
  private dialogRef = inject(MatDialogRef<DialogEditarTrabajadorComponent>);

  trabajador: Trabajadores;
  zonas: any[] = [];
  areas: any[] = [];
  formularioValido = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Trabajadores) {
    console.log("Datos recibidos en diálogo:", data);
    this.trabajador = { ...data };
  }

  ngOnInit() {
    this.cargarZonasYAreas();
    this.validarFormulario();
  }

  cargarZonasYAreas() {
    this.trabajadorService.obtenerZonas().subscribe({
      next: (data) => {
        this.zonas = data;
        console.log("Zonas cargadas:", this.zonas);
      },
      error: (err) => console.error("Error al obtener zonas:", err)
    });

    this.trabajadorService.obtenerAreas().subscribe({
      next: (data) => {
        this.areas = data;
        console.log("Áreas cargadas:", this.areas);
      },
      error: (err) => console.error("Error al obtener áreas:", err)
    });
  }

  validarFormulario() {
    this.formularioValido =
      this.trabajador.NombreTrabajador.trim() !== '' &&
      this.trabajador.IDZona !== '' &&
      this.trabajador.IDArea !== '';
  }

  guardarCambios() {
    console.log("Datos a enviar en edición:", this.trabajador);

    if (!this.trabajador.IDTrabajador) {
      console.error("Error: IDTrabajador no válido");
      alert("Error: El ID del trabajador es inválido");
      return;
    }

    this.trabajadorService.editar(this.trabajador).subscribe({
      next: (response) => {
        console.log("✅ Respuesta del servidor:", response);
        if (response.isSuccess) {
          this.dialogRef.close(true);
        } else {
          alert("No se pudo editar el trabajador");
        }
      },
      error: (err) => {
        console.error("Error al editar:", err);
        alert("Error al editar trabajador");
      }
    });
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
