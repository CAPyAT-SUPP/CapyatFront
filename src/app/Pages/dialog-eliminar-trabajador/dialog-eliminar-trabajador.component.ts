import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TrabajadoresService } from '../../Services/trabajadores.service';
import { Trabajadores } from '../../Models/Trabajadores';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-eliminar-trabajador',
  standalone: true,
  templateUrl: './dialog-eliminar-trabajador.component.html',
  styleUrl: './dialog-eliminar-trabajador.component.css',
  imports: [CommonModule, MatButtonModule, MatDialogActions, MatDialogContent, MatDialogModule]
})
export class DialogEliminarTrabajadorComponent {
  private trabajadorService = inject(TrabajadoresService);
  private dialogRef = inject(MatDialogRef<DialogEliminarTrabajadorComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public trabajador: Trabajadores) {}

  confirmarEliminar() {
    if (this.trabajador.IDTrabajador !== undefined) {
      this.trabajadorService.eliminar(this.trabajador.IDTrabajador).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.dialogRef.close(true);
          } else {
            alert("No se pudo eliminar el trabajador");
          }
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Error al eliminar trabajador");
        }
      });
    } else {
      console.error("Error: IDTrabajador es undefined");
      alert("No se pudo eliminar, ID no válido.");
    }
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
