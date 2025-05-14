import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriasService } from '../../Services/categorias.service';
import { Categorias } from '../../Models/Categorias';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-editar-categoria',
  standalone: true,
  templateUrl: './dialog-editar-categoria.component.html',
  styleUrls: ['./dialog-editar-categoria.component.css'],
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatDialogContent, MatDialogActions
  ]
})
export class DialogEditarCategoriaComponent implements OnInit {
  private categoriaService = inject(CategoriasService);
  private dialogRef = inject(MatDialogRef<DialogEditarCategoriaComponent>);

  categoria: Categorias;
  formularioValido = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Categorias) {
    console.log("Datos recibidos en diálogo:", data);
    this.categoria = { ...data };
  }

  ngOnInit() {
    this.validarFormulario();
  }

  validarFormulario() {
    // Se valida que el nombre de la categoría esté presente
    this.formularioValido = this.categoria.NombreCategoria.trim() !== '';
  }

  guardarCambios() {
    console.log("Datos a enviar en edición:", this.categoria);

    if (!this.categoria.IDCategoria) {
      console.error("Error: IDCategoria no válido");
      alert("Error: El ID de la categoría es inválido");
      return;
    }

    this.categoriaService.editar(this.categoria).subscribe({
      next: (response) => {
        console.log("✅ Respuesta del servidor:", response);
        if (response.isSuccess) {
          this.dialogRef.close(true); // Cierra el diálogo y pasa el éxito
        } else {
          alert("No se pudo editar la categoría");
        }
      },
      error: (err) => {
        console.error("Error al editar:", err);
        alert("Error al editar categoría");
      }
    });
  }

  cerrar() {
    this.dialogRef.close(false); // Cierra el diálogo sin hacer nada
  }
}
