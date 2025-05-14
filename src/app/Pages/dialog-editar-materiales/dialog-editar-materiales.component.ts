import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialesService } from '../../Services/materiales.service';
import { MaterialesTabla } from '../../Models/Materiales';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-editar-materiales',
  standalone: true,
  templateUrl: './dialog-editar-materiales.component.html',
  styleUrl: './dialog-editar-materiales.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogContent,
    MatDialogActions
  ]
})
export class DialogEditarMaterialesComponent implements OnInit {
  private materialesService = inject(MaterialesService);
  private dialogRef = inject(MatDialogRef<DialogEditarMaterialesComponent>);

  material: MaterialesTabla;
  categorias: any[] = [];
  proveedores: any[] = [];
  imagenPreview: string | ArrayBuffer | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: MaterialesTabla) {
    this.material = { ...data };

    if (data.Imagen && typeof data.Imagen === 'string' && !data.Imagen.startsWith('data:image')) {
      this.imagenPreview = `data:image/png;base64,${data.Imagen}`;
    } else {
      this.imagenPreview = data.Imagen ?? null;
    }
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProveedores();
    this.actualizarCostoTotal(); // Cálculo inicial si los valores ya existen
  }

  cargarCategorias() {
    this.materialesService.obtenerCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al obtener categorías:', err)
    });
  }

  cargarProveedores() {
    this.materialesService.obtenerProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => console.error('Error al obtener proveedores:', err)
    });
  }

  onImageClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => this.onImageChange(event);
    input.click();
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo permitido es 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
        this.material.Imagen = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarCostoTotal() {
    const { CostoUnitario, StockActual, Descuento, IVA } = this.material;
    if (CostoUnitario != null && StockActual != null && Descuento != null && IVA != null) {
      const bruto = CostoUnitario * StockActual;
      const ivaMonto = bruto * IVA / 100;
      const total = bruto - Descuento + ivaMonto;
      this.material.CostoTotal = parseFloat(total.toFixed(2));
    }
  }

  guardarCambios() {
    if (!this.material.IDMaterial || this.material.IDMaterial <= 0) {
      alert("Error: IDMaterial inválido");
      return;
    }

    let imagenBase64 = this.material.Imagen;

    if (imagenBase64 && typeof imagenBase64 === 'string' && imagenBase64.startsWith('data:image')) {
      imagenBase64 = imagenBase64.split(',')[1];
    }

    const materialActualizado: MaterialesTabla = {
      ...this.material,
      Imagen: imagenBase64
    };

    this.materialesService.editar(materialActualizado).subscribe({
      next: () => this.dialogRef.close(true), // 🔁 Emitir true para actualizar tabla
      error: (err) => {
        console.error('Error al actualizar material:', err);
        alert('Hubo un error al guardar el material.');
      }
    });
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
