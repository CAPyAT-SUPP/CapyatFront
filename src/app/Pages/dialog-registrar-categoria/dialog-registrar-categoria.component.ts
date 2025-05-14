import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CategoriasService } from '../../Services/categorias.service'; // Asegúrate de que el servicio es el correcto
import { Categorias } from '../../Models/Categorias'; // Asegúrate de que la interfaz Categoria esté importada

@Component({
  selector: 'app-dialog-registrar-categorias',
  templateUrl: './dialog-registrar-categoria.component.html',
  styleUrls: ['./dialog-registrar-categoria.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogActions,
    MatDialogContent
  ]
})
export class DialogRegistrarCategoriasComponent {

  private categoriaService = inject(CategoriasService); // Servicio para la categoría
  
  nuevaCategoria: Categorias = {
    IDCategoria: 0,
    NombreCategoria: '',
    Descripcion: ''
  };

  constructor(private dialogRef: MatDialogRef<DialogRegistrarCategoriasComponent>) {}

  cerrar() {
    this.dialogRef.close();
  }

  registrar() {
    console.log("Enviando categoría:", this.nuevaCategoria);

    // Enviamos la categoría al servicio
    this.categoriaService.registrar(this.nuevaCategoria).subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess) {
          console.log("Categoría registrada correctamente:", respuesta);
          this.dialogRef.close(true); // Cierra el diálogo y retorna true
          window.location.reload(); // Recarga la página para mostrar la nueva categoría
        } else {
          console.error("Error en el registro:", respuesta);
        }
      },
      error: (err) => {
        console.error("Error en la solicitud:", err);
      }
    });
  }
}
