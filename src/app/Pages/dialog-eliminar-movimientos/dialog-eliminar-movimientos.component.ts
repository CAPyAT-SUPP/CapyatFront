import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovimientoService } from '../../Services/movimientos.service';
import { Movimientos } from '../../Models/Movimientos';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-eliminar-movimientos',
  standalone: true,
  templateUrl: './dialog-eliminar-movimientos.component.html',
  styleUrls: ['./dialog-eliminar-movimientos.component.css'],
  imports: [
    CommonModule, MatButtonModule, MatDialogActions, MatDialogContent
  ]
})
export class DialogEliminarMovimientoComponent {
  private movimientoService = inject(MovimientoService);
  private dialogRef = inject(MatDialogRef<DialogEliminarMovimientoComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public movimiento: Movimientos) {}

  eliminarMovimiento() {
    if (!this.movimiento.IDMovimiento) {
      console.error("Error: IDMovimiento no válido");
      alert("Error: El ID del movimiento es inválido");
      return;
    }

    this.movimientoService.eliminar(this.movimiento.IDMovimiento).subscribe({
      next: () => {
        console.log("Movimiento eliminado correctamente");
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Error al eliminar movimiento:", err);
        alert("Error al eliminar movimiento");
      }
    });
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}