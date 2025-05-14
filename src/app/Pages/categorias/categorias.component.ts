import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CategoriasTabla } from '../../Models/Categorias';
import { CategoriasService } from '../../Services/categorias.service';
import { DialogRegistrarCategoriasComponent } from '../dialog-registrar-categoria/dialog-registrar-categoria.component';
import { DialogEditarCategoriaComponent } from '../dialog-editar-categoria/dialog-editar-categoria.component';
import { DialogEliminarCategoriaComponent } from '../dialog-eliminar-categoria/dialog-eliminar-categoria.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html', // Se corrigió el nombre del template
  styleUrls: ['./categorias.component.css'],
  imports: [
    CommonModule, MatPaginatorModule, MatTableModule, MatButtonModule, MatCardModule,
    MatIconModule, MatInputModule, MatMenuModule, FormsModule, MatDialogModule, MatDividerModule,
  ]
})
export class CategoriasComponent implements OnInit, AfterViewInit {

  private categoriaService = inject(CategoriasService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'IDCategoria', 'NombreCategoria', 'Descripcion', 'accion'
  ];

  dataSource = new MatTableDataSource<CategoriasTabla>([]);
  listaOriginal: CategoriasTabla[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filtroValor: string = '';
  userRole: string = '';

  constructor() {}

  async cargarDatos() {
    try {
      this.categoriaService.lista().subscribe({
        next: (data) => {
          console.log("📥 Datos RAW de la API:", data);  // Verificar qué datos llegan
  
          if (!data || data.length === 0) {
            console.error("⚠ No se recibieron datos de la API");
            return;
          }
  
          // Verificar si los datos son correctos
          this.listaOriginal = data.map((p: any) => ({
            IDCategoria: p.idCategoria ?? 0,
            NombreCategoria: p.nombreCategoria?.trim() || 'Sin nombre',
            Descripcion: p.descripcion?.trim() || 'Sin descripción'
          }));
  
          console.log("✅ Datos procesados correctamente:", this.listaOriginal);
          this.dataSource.data = this.listaOriginal;
        },
        error: (err) => console.error("❌ Error al obtener categorías:", err.message)
      });
    } catch (error) {
      console.error("❌ Error en cargarDatos:", error);
    }
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

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = valorFiltro;
  }

  ordenar(direccion: 'asc' | 'desc') {
    console.log(`🔄 Ordenando categorías en orden ${direccion.toUpperCase()}`);
    this.dataSource.data = [...this.listaOriginal].sort((a, b) => {
      return direccion === 'asc'
        ? a.NombreCategoria.localeCompare(b.NombreCategoria)
        : b.NombreCategoria.localeCompare(a.NombreCategoria);
    });
  }

  resetearFiltros() {
    console.log("🔄 Restableciendo filtros y volviendo a la lista original");
    this.dataSource.data = this.listaOriginal;
    this.filtroValor = '';
  }

  nuevo() {
    const dialogRef = this.dialog.open(DialogRegistrarCategoriasComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargarDatos(); });
  }

  editar(categoria: CategoriasTabla) {
    const dialogRef = this.dialog.open(DialogEditarCategoriaComponent, { width: '400px', data: categoria });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargarDatos(); });
  }

  eliminar(categoria: CategoriasTabla) {
    const dialogRef = this.dialog.open(DialogEliminarCategoriaComponent, { width: '300px', data: categoria });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargarDatos(); });
  }

  generarPDF() {
    if (!this.listaOriginal || this.listaOriginal.length === 0) {
      alert("No hay datos para generar el PDF.");
      return;
    }
  
    const doc = new jsPDF({
      orientation: "portrait", // Usa orientación vertical para aprovechar mejor el espacio en este caso
      unit: "mm",
      format: "a4"
    });
  
    const fechaActual = new Date().toLocaleDateString();
  
    // Título y fecha en el encabezado
    doc.setFontSize(18);
    doc.text('Reporte de Categorías', 105, 15, { align: 'center' }); // Centrado
  
    doc.setFontSize(12);
    doc.text(`Fecha: ${fechaActual}`, 190, 15, { align: 'right' });  // Fecha en la esquina derecha
  
    doc.setFontSize(10);
    doc.text('Listado de categorías:', 14, 25);  // Título de la tabla
  
    // Formatear datos para la tabla
    const data = this.listaOriginal.map(categoria => [
      categoria.IDCategoria?.toString() || 'N/A',  // ID de la categoría
      categoria.NombreCategoria || 'Sin nombre',  // Nombre de la categoría
      categoria.Descripcion || 'Sin descripción'  // Descripción
    ]);
  
    // Crear la tabla con autoTable
    autoTable(doc, {
      startY: 30, // Inicio de la tabla
      head: [['ID', 'Nombre', 'Descripción']],  // Encabezado
      body: data,  // Cuerpo de la tabla con los datos
      theme: 'striped', // Tema de la tabla
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },  // Estilo de las celdas
      headStyles: { fillColor: [52, 152, 219], textColor: 255 }, // Estilo del encabezado
      columnStyles: {
        0: { cellWidth: 15 },   // ID (ajustado a 15mm)
        1: { cellWidth: 45 },   // Nombre (ajustado a 45mm)
        2: { cellWidth: 90 },   // Descripción (ajustado a 90mm)
      },
      margin: { top: 25, left: 10, right: 10 },  // Márgenes para optimizar el espacio
      horizontalPageBreak: true,  // Salto de página horizontal si es necesario
    });
  
    // Guardar el PDF generado
    doc.save('Reporte_Categorias.pdf');
  }
  
}
