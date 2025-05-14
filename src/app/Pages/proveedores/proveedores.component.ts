import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TrabajadoresService } from '../../Services/trabajadores.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Trabajadores, TrabajadoresTabla } from '../../Models/Trabajadores';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DialogRegistrarProveedoresComponent } from '../dialog-registrar-proveedores/dialog-registrar-proveedores.component';
import { DialogEditarProveedorComponent } from '../dialog-editar-proveedores/dialog-editar-proveedores.component';
import { DialogEliminarProveedoresComponent } from '../dialog-eliminar-proveedores/dialog-eliminar-proveedores.component';
import { Proveedores, ProveedoresTabla } from '../../Models/Proveedores';
import { ProveedoresService } from '../../Services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, 
    MatPaginatorModule, MatTableModule, MatButtonModule, MatCardModule,
    MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, FormsModule, MatDividerModule, MatDialogModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit, AfterViewInit {

  private proveedorService = inject(ProveedoresService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'IDProveedor' ,'NombreProveedor', 'ClaveProveedor', 'CalleProveedor', 'NoIntProveedor',
    'NoExtProveedor', 'ColoniaProveedor', 'CP', 'Estado', 'Municipio', 'RFC', 'accion'
  ];
  dataSource = new MatTableDataSource<ProveedoresTabla>([]);
  listaOriginal: ProveedoresTabla[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filtroValor: string = '';
  userRole: string = '';

  constructor() {}

  async cargarDatos() {
    try {
      this.proveedorService.lista().subscribe({
        next: (data) => {
    
          if (!data || data.length === 0) {
            return;
          }
  
          this.listaOriginal = data.map((p: any) => ({
            IDProveedor: p.idProveedor ?? null,
            NombreProveedor: p.nombreProveedor?.trim() || 'N/A',
            ClaveProveedor: p.claveProveedor?.trim() || 'N/A',
            CalleProveedor: p.calleProveedor?.trim() || 'N/A',
            NoIntProveedor: p.noIntProveedor ?? null,
            NoExtProveedor: p.noExtProveedor ?? null,
            ColoniaProveedor: p.coloniaProveedor?.trim() || 'N/A',
            CP: p.cp ?? null,
            Estado: p.estado?.trim() || 'N/A',
            Municipio: p.municipio?.trim() || 'N/A',
            RFC: p.rfc?.trim() || 'N/A'
          }));          
          
  
          this.dataSource.data = this.listaOriginal;
        },
        error: (err) => console.error("Error al obtener proveedores:", err.message)
      });
    } catch (error) {
    }
  }
  

  ngOnInit() {
    this.cargarDatos();
    this.configurarFiltro();
    const data = localStorage.getItem('user_data');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      this.userRole = parsed.usuario?.nombreRol ?? '';
    } catch (e) {
    }
  }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  configurarFiltro() {
    this.dataSource.filterPredicate = (data: ProveedoresTabla, filtro: string) => {
      const filtroLower = filtro.toLowerCase();
      return data.NombreProveedor.toLowerCase().includes(filtroLower) ||
             data.ClaveProveedor.toLowerCase().includes(filtroLower) ||
             data.Estado.toLowerCase().includes(filtroLower) ||
             data.RFC.toLowerCase().includes(filtroLower);
    };
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = valorFiltro;
  }

  ordenar(direccion: 'asc' | 'desc') {
    this.dataSource.data = [...this.listaOriginal].sort((a, b) => {
      return direccion === 'asc'
        ? a.NombreProveedor.localeCompare(b.NombreProveedor)
        : b.NombreProveedor.localeCompare(a.NombreProveedor);
    });
  }

  resetearFiltros() {
    this.dataSource.data = this.listaOriginal;
    this.filtroValor = '';
  }

  nuevo() {
    const dialogRef = this.dialog.open(DialogRegistrarProveedoresComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargarDatos(); });
  }

  editar(proveedor: ProveedoresTabla) {
    const dialogRef = this.dialog.open(DialogEditarProveedorComponent, { width: '400px', data: proveedor });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargarDatos(); });
  }

  eliminar(proveedor: ProveedoresTabla) {
    const dialogRef = this.dialog.open(DialogEliminarProveedoresComponent, { width: '300px', data: proveedor });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargarDatos(); });
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
    if (!this.listaOriginal || this.listaOriginal.length === 0) {
      console.error("No hay datos disponibles para generar el PDF.");
      alert("No hay datos para generar el PDF.");
      return;
    }
  
    const reader = new FileReader();
    const img = new Image();
    img.src = 'assets/logo.png';  // Asegúrate de tener el logo en esta ubicación
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL('image/png');
  
      // Crear el PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
  
      // Agregar el logo a la esquina superior derecha
      doc.addImage(logoBase64, 'PNG', 20, 5, 40, 30); // Tamaño y posición del logo
  
      const Y_OFFSET = 10; // Desplazamiento hacia abajo para el contenido
  
      // Encabezado del documento
      doc.setFontSize(18);
      doc.text('Reporte de Proveedores', 148, 15 + Y_OFFSET, { align: 'center' });
  
      const fechaActual = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.text(`Fecha: ${fechaActual}`, 270, 15 + Y_OFFSET, { align: 'right' });
  
      // Subtítulo
      doc.setFontSize(10);
  
      // Formatear datos para la tabla
      const data = this.listaOriginal.map(proveedor => [
        proveedor.IDProveedor?.toString() || 'N/A',
        proveedor.NombreProveedor || 'N/A',
        proveedor.ClaveProveedor || 'N/A',
        proveedor.CalleProveedor || 'N/A',
        proveedor.NoIntProveedor !== null ? proveedor.NoIntProveedor.toString() : 'N/A',
        proveedor.NoExtProveedor !== null ? proveedor.NoExtProveedor.toString() : 'N/A',
        proveedor.ColoniaProveedor || 'N/A',
        proveedor.CP !== null ? proveedor.CP.toString() : 'N/A',
        proveedor.Estado || 'N/A',
        proveedor.Municipio || 'N/A',
        proveedor.RFC || 'N/A'
      ]);
  
      // Generar tabla
      autoTable(doc, {
        startY: 30 + Y_OFFSET, // Desplazar la tabla hacia abajo
        head: [['ID', 'Nombre', 'Clave', 'Calle', 'No Int', 'No Ext', 'Colonia', 'CP', 'Estado', 'Municipio', 'RFC']],
        body: data,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        headStyles: { fillColor: [52, 152, 219], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 10 },   // ID
          1: { cellWidth: 40 },   // Nombre
          2: { cellWidth: 20 },   // Clave
          3: { cellWidth: 40 },   // Calle
          4: { cellWidth: 15 },   // No Int
          5: { cellWidth: 15 },   // No Ext
          6: { cellWidth: 30 },   // Colonia
          7: { cellWidth: 15 },   // CP
          8: { cellWidth: 25 },   // Estado
          9: { cellWidth: 25 },   // Municipio
          10: { cellWidth: 30 }   // RFC
        },
        margin: { top: 25 + Y_OFFSET, left: 10, right: 10 },
        horizontalPageBreak: true,
      });
  
      doc.save('Reporte_Proveedores.pdf');
    };
  }
}  