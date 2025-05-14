import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedoresService } from '../../Services/proveedores.service';
import { Proveedores } from '../../Models/Proveedores';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-editar-proveedor',
  standalone: true,
  templateUrl: './dialog-editar-proveedores.component.html',
  styleUrls: ['./dialog-editar-proveedores.component.css'],
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDialogContent, MatDialogActions
  ]
})
export class DialogEditarProveedorComponent implements OnInit {
  private proveedorService = inject(ProveedoresService);
  private dialogRef = inject(MatDialogRef<DialogEditarProveedorComponent>);
  private cdr = inject(ChangeDetectorRef);

  proveedor: Proveedores;
  proveedorOriginal: Proveedores; // Almacena los datos originales para detectar cambios
  formularioValido = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("Datos recibidos en diálogo de edición:", data);

    // Inicializa los valores y guarda una copia para comparaciones
    this.proveedor = { 
      IDProveedor: data.IDProveedor ?? '',
      nombreProveedor: data.NombreProveedor ?? '',
      claveProveedor: data.ClaveProveedor ?? '',
      calleProveedor: data.CalleProveedor ?? '',
      noIntProveedor: data.NoIntProveedor ?? '',
      noExtProveedor: data.NoExtProveedor ?? '',
      coloniaProveedor: data.ColoniaProveedor ?? '',
      cp: data.CP ?? 0,
      estado: data.Estado ?? '',
      municipio: data.Municipio ?? '',
      rfc: data.RFC ?? ''
    };

    // Guardar los datos originales para comparar cambios
    this.proveedorOriginal = { ...this.proveedor };
  }

  ngOnInit() {
    this.verificarCambios();
    this.cdr.detectChanges(); // Forzar actualización de la vista
  }

  verificarCambios() {
    // Compara si hubo cambios en los campos del formulario
    this.formularioValido = JSON.stringify(this.proveedor) !== JSON.stringify(this.proveedorOriginal);
  }

  guardarCambios() {
    console.log("Enviando datos para edición:", this.proveedor);
  
    // Cambiar la validación de IDProveedor para asegurar que sea un valor mayor a 0
    if (!this.proveedor.IDProveedor || this.proveedor.IDProveedor <= 0) {
      console.error("Error: IDProveedor no válido");
      alert("Error: El ID del proveedor es inválido");
      return;
    }
  
    this.proveedorService.editar(this.proveedor).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        if (response.isSuccess) {
          this.dialogRef.close(true);
        } else {
          alert("No se pudo editar el proveedor");
        }
      },
      error: (err) => {
        console.error("Error al editar:", err);
        alert("Error al editar proveedor");
      }
    });
  }
  

  cerrar() {
    this.dialogRef.close(false);
  }
}
