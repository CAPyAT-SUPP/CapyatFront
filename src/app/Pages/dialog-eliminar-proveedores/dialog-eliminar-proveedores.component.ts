import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedoresService } from '../../Services/proveedores.service';
import { Proveedores } from '../../Models/Proveedores';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-eliminar-proveedor',
  standalone: true,
  templateUrl: './dialog-eliminar-proveedores.component.html',
  styleUrls: ['./dialog-eliminar-proveedores.component.css'],
  imports: [
    CommonModule, MatButtonModule, MatDialogActions, MatDialogContent
  ]
})
export class DialogEliminarProveedoresComponent {
  private proveedorService = inject(ProveedoresService);
  private dialogRef = inject(MatDialogRef<DialogEliminarProveedoresComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public proveedor: Proveedores) {}

  eliminarProveedor() {
    if (!this.proveedor.IDProveedor) {
      console.error("Error: IDProveedor no válido");
      alert("Error: El ID del proveedor es inválido");
      return;
    }

    this.proveedorService.eliminar(this.proveedor.IDProveedor).subscribe({
      next: () => {
        console.log("Proveedor eliminado correctamente");
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Error al eliminar proveedor:", err);
        alert("Error al eliminar proveedor");
      }
    });
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
