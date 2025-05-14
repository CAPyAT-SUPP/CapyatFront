import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { ProveedoresService } from '../../Services/proveedores.service';
import { Proveedores } from '../../Models/Proveedores';  // Asegúrate de importar la interfaz correcta

@Component({
  selector: 'app-dialog-registrar-proveedores',
  templateUrl: './dialog-registrar-proveedores.component.html',
  styleUrls: ['./dialog-registrar-proveedores.component.css'],
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
export class DialogRegistrarProveedoresComponent {

  private proveedorService = inject(ProveedoresService);
  
  nuevoProveedor: Proveedores = {
    IDProveedor: 0,
    nombreProveedor: '',
    claveProveedor: '',
    calleProveedor: '',
    noIntProveedor: null,
    noExtProveedor: null,
    coloniaProveedor: '',
    cp: null,
    estado: '',
    municipio: '',
    rfc: ''
  };

  constructor(private dialogRef: MatDialogRef<DialogRegistrarProveedoresComponent>) {}

  cerrar() {
    this.dialogRef.close();
  }

  registrar() {
    console.log("Enviando proveedor:", this.nuevoProveedor);
    
    this.proveedorService.registrar(this.nuevoProveedor).subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess) {
          console.log("Proveedor registrado correctamente:", respuesta);
          this.dialogRef.close(true);
          window.location.reload();
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
//window.location.reload();