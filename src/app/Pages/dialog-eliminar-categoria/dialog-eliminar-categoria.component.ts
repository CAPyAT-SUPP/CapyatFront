import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CategoriasService } from '../../Services/categorias.service';
import { Categorias } from '../../Models/Categorias';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-eliminar-categoria',
  standalone: true,
  templateUrl: './dialog-eliminar-categoria.component.html',
  styleUrls: ['./dialog-eliminar-categoria.component.css'],
  imports: [CommonModule, MatButtonModule, MatDialogActions, MatDialogContent, MatDialogModule]
})
export class DialogEliminarCategoriaComponent {
  private categoriaService = inject(CategoriasService);
  private dialogRef = inject(MatDialogRef<DialogEliminarCategoriaComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public categoria: Categorias) {}

  confirmarEliminar() {
    if (this.categoria.IDCategoria !== undefined) {
      this.categoriaService.eliminar(this.categoria.IDCategoria).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.dialogRef.close(true); // Cierra el diálogo y pasa el éxito
          } else {
            alert("No se pudo eliminar la categoría");
          }
        },
        error: (err) => {
          console.error("Error al eliminar:", err);
          alert("Error al eliminar categoría");
        }
      });
    } else {
      console.error("Error: IDCategoria es undefined");
      alert("No se pudo eliminar, ID no válido.");
    }
  }

  cerrar() {
    this.dialogRef.close(false); // Cierra el diálogo sin hacer nada
  }
}
