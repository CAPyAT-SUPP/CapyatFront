import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MaterialesService } from '../../Services/materiales.service';
import { MaterialesTabla } from '../../Models/Materiales';
import { DialogRegistrarMaterialesComponent } from '../dialog-registrar-materiales/dialog-registrar-materiales.component';
import { DialogEditarMaterialesComponent } from '../dialog-editar-materiales/dialog-editar-materiales.component';
import { DialogEliminarMaterialComponent } from '../dialog-eliminar-materiales/dialog-eliminar-materiales.component';
import { AuthService } from '../../Services/Auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-materiales',
  standalone: true,
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css'],
  imports: [
    CommonModule,
    MatPaginatorModule, MatTableModule, MatButtonModule, MatCardModule,
    MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, FormsModule, 
    MatDividerModule, MatDialogModule
  ]
})
export class MaterialesComponent implements OnInit, AfterViewInit {
  private materialesService = inject(MaterialesService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'NombreMaterial', 'DescripcionMaterial', 'CantidadMaterial', 
    'CostoUnitario', 'CostoTotal', 'StockActual', 
    'Imagen', 'IDCategoria', 'IDProveedor', 'accion'
  ];

  dataSource = new MatTableDataSource<MaterialesTabla>([]);
  listaOriginal: MaterialesTabla[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtroNombre: string = '';  
  filtroCategoria: string = ''; 
  filtroProveedor: string = ''; 

  categorias: any[] = [];
  proveedores: any[] = [];
  userRole: string = '';

  constructor() {}

  async cargarDatos() {
    try {
      // Cargar materiales
      this.materialesService.lista().subscribe({
        next: (data) => {
          if (!data || data.length === 0) {
            return;
          }

          this.listaOriginal = data.map((m: any) => ({
            IDMaterial: m.idMaterial ?? 0,
            NombreMaterial: m.nombreMaterial?.trim() || 'N/A',
            DescripcionMaterial: m.descripcionMaterial?.trim() || 'Sin descripción', 
            CantidadMaterial: m.cantidadMaterial ?? 0,
            CostoUnitario: m.costoUnitario ?? 0,
            CostoTotal: m.costoTotal ?? 0,
            Descuento: m.descuento ?? 0,
            IVA: m.iva ?? 0,
            StockActual: m.stockActual ?? 0,
            IDCategoria: m.idCategoria ?? 0,
            IDProveedor: m.idProveedor ?? 0,
            Imagen: m.imagen || 'Sin imagen'
          }));

          this.dataSource.data = this.listaOriginal;
        },
        error: (err) => console.error("Error al obtener materiales:", err.message)
      });

      // Cargar categorías
      this.materialesService.obtenerCategorias().subscribe({
        next: (data) => {
          this.categorias = data;
          console.log("Categorías cargadas:", this.categorias);
        },
        error: (err) => console.error("Error al obtener categorías:", err.message)
      });

      // Cargar proveedores
      this.materialesService.obtenerProveedores().subscribe({
        next: (data) => {
          this.proveedores = data;
          console.log("Proveedores cargados:", this.proveedores);
        },
        error: (err) => console.error("Error al obtener proveedores:", err.message)
      });

    } catch (error) {
      console.error("Error en cargarDatos:", error);
    }
  }  

   // Convertir el buffer de imagen a Base64
   convertirABase64(buffer: any): string {
    return `data:image/png;base64,${buffer}`;
  }

  ngOnInit() {
    this.cargarDatos();
    const data = localStorage.getItem('user_data');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      this.userRole = parsed.usuario?.nombreRol ?? '';
    } catch (e) {
      console.error("Error al parsear user_data", e);
    }
  }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Obtener nombre de Categoría
  getCategoriaNombre(idCategoria: number | string): string {
    const categoria = this.categorias.find(c => Number(c.idCategoria) === Number(idCategoria));
    return categoria ? categoria.nombreCategoria : 'Desconocida';
  }

  // Obtener nombre de Proveedor
  getProveedorNombre(idProveedor: number | string): string {
    const proveedor = this.proveedores.find(p => Number(p.idProveedor) === Number(idProveedor));
    return proveedor ? proveedor.nombreProveedor : 'Desconocido';
  }

  aplicarFiltro(event: Event) {
    const filtroValor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filtroValor;
  }

  ordenar(direccion: 'asc' | 'desc') {
    this.dataSource.data = [...this.dataSource.data].sort((a, b) => {
      return direccion === 'asc'
        ? a.NombreMaterial.localeCompare(b.NombreMaterial)
        : b.NombreMaterial.localeCompare(a.NombreMaterial);
    });
  }

  resetearFiltros() {
    this.filtroNombre = '';
    this.filtroCategoria = '';
    this.filtroProveedor = '';
    this.dataSource.data = this.listaOriginal;
  }

  nuevo() {
    const dialogRef = this.dialog.open(DialogRegistrarMaterialesComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.cargarDatos(); });
  }
  
  editar(objeto: MaterialesTabla) {
    const dialogRef = this.dialog.open(DialogEditarMaterialesComponent, { width: '400px', data: objeto });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.cargarDatos(); });
  }
  
  eliminar(objeto: MaterialesTabla) {
    const dialogRef = this.dialog.open(DialogEliminarMaterialComponent, { width: '400px', data: objeto });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.cargarDatos(); });
  }

  getImagen(imagen: string): string {
    if (!imagen) {
      console.warn('Imagen no disponible');
      return 'assets/no-image.png'; // Asegúrate de que esta imagen existe en `src/assets/`
    }
  
    if (imagen.startsWith('data:image')) {
      return imagen; // Es una imagen Base64 válida
    }
  
    return `data:image/png;base64,${imagen}`; // Agrega el prefijo si falta
  }

  aplicarFiltroCategoria() {
    const categoriaFiltrada = Number(this.filtroCategoria); // Asegúrate de que filtroCategoria es un número
    this.dataSource.data = this.listaOriginal.filter(item => {
      return categoriaFiltrada ? item.IDCategoria === categoriaFiltrada : true;
    });
  }
  
  aplicarFiltroProveedor() {
    const proveedorFiltrado = Number(this.filtroProveedor); // Asegúrate de que filtroProveedor es un número
    this.dataSource.data = this.listaOriginal.filter(item => {
      return proveedorFiltrado ? item.IDProveedor === proveedorFiltrado : true;
    });
  }
  
  
  arrayBufferToBase64(buffer: any): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  

  generarPDF() {
    const reader = new FileReader();
    const img = new Image();
    img.src = 'assets/logo.png';
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL('image/png');
  
      const doc = new jsPDF();
  
      // Insertar logo con mayor tamaño y espacio
      doc.addImage(logoBase64, 'PNG', 170, 5, 25, 20); // Aumenta el tamaño aquí
  
      // Ajustar las posiciones de los elementos para que no se solapen con el logo
      const Y_OFFSET = 15; // Desplazamiento hacia abajo para todo el contenido
  
      // Título
      doc.setFontSize(7);
      doc.text('Reporte de Materiales', 14, 10 + Y_OFFSET); // Desplazar título hacia abajo
  
      // Línea horizontal
      doc.setLineWidth(0.5);
      doc.line(10, 12 + Y_OFFSET, 200, 12 + Y_OFFSET); // Desplazar línea hacia abajo
  
      // Fecha
      doc.setFontSize(6);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 18 + Y_OFFSET); // Desplazar fecha hacia abajo
  
      // Tabla
      autoTable(doc, {
        startY: 22 + Y_OFFSET, // Desplazar tabla hacia abajo
        head: [['Nombre', 'Descripción', 'Cantidad', 'Costo Unitario', 'Costo Total', 'Stock Actual', 'Categoría', 'Proveedor']],
        body: this.listaOriginal.map(m => [
          m.NombreMaterial, m.DescripcionMaterial, m.CantidadMaterial, m.CostoUnitario,
          m.CostoTotal, m.StockActual,
          this.getCategoriaNombre(m.IDCategoria), this.getProveedorNombre(m.IDProveedor)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 122, 204], fontSize: 6 },
        bodyStyles: { fontSize: 6 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 22 + Y_OFFSET, left: 15, right: 15, bottom: 10 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 25 }
        },
        showHead: 'firstPage',
      });
  
      doc.save('Materiales.pdf');
    };
  }  
}