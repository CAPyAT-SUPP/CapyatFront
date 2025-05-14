import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialesService } from '../../Services/materiales.service';  // Aquí deberías tener el servicio de materiales
import { Materiales } from '../../Models/Materiales';  // Y la clase Materiales
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-eliminar-materiales',
  standalone: true,
  templateUrl: './dialog-eliminar-materiales.component.html',
  styleUrls: ['./dialog-eliminar-materiales.component.css'],
  imports: [CommonModule, MatButtonModule, MatDialogActions, MatDialogContent, MatDialogModule]
})
export class DialogEliminarMaterialComponent {
  private materialesService = inject(MaterialesService);
  private dialogRef = inject(MatDialogRef<DialogEliminarMaterialComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public material: Materiales) {}

  confirmarEliminar() {
    if (this.material.IDMaterial !== undefined) {
      this.materialesService.eliminar(this.material.IDMaterial).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.dialogRef.close(true);  // Cierra el diálogo y pasa un valor `true` indicando que se eliminó
          } else {
            alert("No se pudo eliminar el material");
          }
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Error al eliminar material");
        }
      });
    } else {
      console.error("Error: IDMaterial es undefined");
      alert("No se pudo eliminar, ID no válido.");
    }
  }

  cerrar() {
    this.dialogRef.close(false);  // Cierra el diálogo sin eliminar
  }
}
