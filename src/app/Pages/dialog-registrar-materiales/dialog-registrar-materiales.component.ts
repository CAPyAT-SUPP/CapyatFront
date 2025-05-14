import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MaterialesService } from '../../Services/materiales.service';
import { Materiales } from '../../Models/Materiales';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-dialog-registrar-materiales',
  templateUrl: './dialog-registrar-materiales.component.html',
  styleUrls: ['./dialog-registrar-materiales.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogActions,
    MatDialogContent,
    MatSelectModule,
    MatOptionModule
  ]
})
export class DialogRegistrarMaterialesComponent {

  private materialesService = inject(MaterialesService);
  
  nuevoMaterial: Materiales = {
    NombreMaterial: '',
    DescripcionMaterial: '',
    CantidadMaterial: 0,
    CostoUnitario: 0,
    CostoTotal: 0,
    Descuento: 0,
    IVA: 0,
    StockActual: 0,
    Imagen: '',
    IDCategoria: 0,
    IDProveedor: 0
  };

  ngOnInit() {
    this.obtenerCategorias();
    this.obtenerProveedores();
  }  

  categorias: { IDCategoria: number; NombreCategoria: string }[] = [];
  proveedores: { IDProveedor: number; NombreProveedor: string }[] = [];


  imagenPreview: string | null = null;
  imagenInvalida: boolean = false;

  constructor(private dialogRef: MatDialogRef<DialogRegistrarMaterialesComponent>) {}

  get nombreInvalido(): boolean {
    return this.nuevoMaterial.NombreMaterial.trim() === '';
  }

  get descripcionInvalida(): boolean {
    return this.nuevoMaterial.DescripcionMaterial.trim() === '';
  }

  get cantidadInvalida(): boolean {
    return this.nuevoMaterial.CantidadMaterial <= 0;
  }

  get costoUnitarioInvalido(): boolean {
    return this.nuevoMaterial.CostoUnitario <= 0;
  }

  get descuentoInvalido(): boolean {
    return this.nuevoMaterial.Descuento < 0 || this.nuevoMaterial.Descuento > 100;
  }

  get ivaInvalido(): boolean {
    return this.nuevoMaterial.IVA < 0 || this.nuevoMaterial.IVA > 100;
  }

  get stockInvalido(): boolean {
    return this.nuevoMaterial.StockActual < 0;
  }

  get categoriaInvalida(): boolean {
    return this.nuevoMaterial.IDCategoria <= 0;
  }

  get proveedorInvalido(): boolean {
    return this.nuevoMaterial.IDProveedor <= 0;
  }

  get formularioValido(): boolean {
    return !this.nombreInvalido &&
           !this.descripcionInvalida &&
           !this.cantidadInvalida &&
           !this.costoUnitarioInvalido &&
           !this.descuentoInvalido &&
           !this.ivaInvalido &&
           !this.stockInvalido &&
           !this.categoriaInvalida &&
           !this.proveedorInvalido &&
           !this.imagenInvalida;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > 2 * 1024 * 1024) { // Máximo 2MB
        this.imagenInvalida = true;
        this.imagenPreview = null;
        return;
      }

      this.imagenInvalida = false;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        this.nuevoMaterial.Imagen = reader.result as string; // Guardamos la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  obtenerCategorias() {
    this.materialesService.obtenerCategorias().subscribe({
      next: (data) => {
        console.log("Categorías recibidas:", data); // Debug
        this.categorias = data.map(c => ({
          IDCategoria: c.idCategoria,  // Se ajusta a lo que devuelve la API
          NombreCategoria: c.nombreCategoria
        }));
      },
      error: (err) => {
        console.error("Error al obtener categorías:", err);
      }
    });
  }
  
  
  obtenerProveedores() {
    this.materialesService.obtenerProveedores().subscribe({
      next: (data) => {
        console.log("Proveedores recibidos:", data); // Debug
        this.proveedores = data.map(p => ({
          IDProveedor: p.idProveedor, // Se ajusta a lo que devuelve la API
          NombreProveedor: p.nombreProveedor
        }));
      },
      error: (err) => {
        console.error("Error al obtener proveedores:", err);
      }
    });
  }
  
  registrar() {
    if (!this.formularioValido) {
      return;
    }
  
    const { CostoTotal, ...materialSinCostoTotal } = this.nuevoMaterial; // Excluir CostoTotal
  
    const materialParaEnviar = { ...materialSinCostoTotal };
  
    // Verificamos si la imagen es string antes de aplicar split
    if (typeof this.nuevoMaterial.Imagen === 'string' && this.nuevoMaterial.Imagen.includes(',')) {
      materialParaEnviar.Imagen = this.nuevoMaterial.Imagen.split(',')[1]; // Quitamos el encabezado "data:image/png;base64,"
    } else {
      materialParaEnviar.Imagen = null; // Si no es string, enviamos null para evitar errores
    }
  
    this.materialesService.registrar(materialParaEnviar).subscribe({
      next: (respuesta) => {
        this.dialogRef.close(true);
        window.location.reload();
      },
      error: (err) => {
        console.error("Error en la solicitud:", err);
      }
    });
  }
  
}
