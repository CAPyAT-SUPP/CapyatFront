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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MovimientoService } from '../../Services/movimientos.service';
import { MovimientosTabla } from '../../Models/Movimientos';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { firstValueFrom } from 'rxjs';
import { DialogRegistrarMovimientoComponent } from '../dialog-registrar-movimientos/dialog-registrar-movimientos.component';
import { DialogEditarMovimientosComponent } from '../dialog-editar-movimientos/dialog-editar-movimientos.component';
import { DialogEliminarMovimientoComponent } from '../dialog-eliminar-movimientos/dialog-eliminar-movimientos.component';
import { MovimientoConDetallesDTO } from '../../Models/Movimiento-full.dto';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MovimientosComponent implements OnInit, AfterViewInit {

  private movimientoService = inject(MovimientoService);

  displayedColumns: string[] = ['Trabajador', 'Almacen', 'TipoMovimiento', 'FechaMovimiento', 'Acciones'];
  dataSource = new MatTableDataSource<MovimientosTabla>([]);
  listaOriginal: MovimientosTabla[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  trabajadores: any[] = [];
  almacenes: any[] = [];
  tiposMovimiento: any[] = [];

  filtroTrabajador: string = '';
  filtroAlmacen: string = '';
  filtroTipo: string = '';
  filtroFecha: string = '';
  userRole: string = '';

  constructor(private router: Router, private dialog: MatDialog) { }

  async cargarDatos() {
    try {
      this.movimientoService.obtenerMovimientos().subscribe({
        next: (data) => {
          this.listaOriginal = data.map((m: any) => ({
            IDMovimiento: m.idMovimiento ?? 0,
            IDTrabajador: m.trabajador?.idTrabajador ?? 0,
            IDAlmacen: m.almacen?.idAlmacen ?? 0,
            IDTipoMovimiento: m.tipoMovimiento?.idTipoMovimiento ?? 0,
            FechaMovimiento: m.fechaMovimiento ?? '',
            NombreTrabajador: m.trabajador?.nombreTrabajador ?? '',
            NombreAlmacen: m.almacen?.nombreAlmacen ?? '',
            TipoMovimiento: m.tipoMovimiento?.tipoMovimientoDes ?? '',
            Fecha: m.fechaMovimiento?.split('T')[0] ?? '',
            Detalles: m.detalles ?? [],
            expandido: false
          }));

          this.dataSource.data = this.listaOriginal;
          this.cargarOpcionesFiltros();
        },
        error: (err) => console.error('Error al obtener movimientos:', err.message)
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  cargarOpcionesFiltros() {
    this.almacenes = Array.from(new Set(this.listaOriginal.map(m => m.NombreAlmacen)))
      .map(a => ({ nombre: a }));

    this.tiposMovimiento = Array.from(new Set(this.listaOriginal.map(m => m.TipoMovimiento)))
      .map(t => ({ nombre: t }));
  }

  ngOnInit() {
    this.cargarDatos();
    const data = localStorage.getItem('user_data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.userRole = parsed.usuario?.nombreRol ?? '';
        if (this.userRole !== 'Administrador') {
          this.displayedColumns = this.displayedColumns.filter(col => col !== 'Acciones');
        }
      } catch (e) {
        console.error("Error al parsear user_data", e);
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltroTexto(event: Event) {
    const filtroValor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filtroValor;
  }

  filtrar() {
    this.dataSource.data = this.listaOriginal.filter(mov => {
      const coincideAlmacen = this.filtroAlmacen ? 
        mov.NombreAlmacen === this.filtroAlmacen : true;
      const coincideTipo = this.filtroTipo ? 
        mov.TipoMovimiento === this.filtroTipo : true;
      
      return coincideAlmacen && coincideTipo;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtrarPorTipoMovimiento(): void {
    this.filtrar();
  }

  filtrarPorAlmacen(): void {
    this.filtrar();
  }

  ordenar(orden: 'asc' | 'desc'): void {
    this.listaOriginal.sort((a, b) => {
      const valorA = a.Fecha;
      const valorB = b.Fecha;

      if (orden === 'asc') {
        return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
      } else {
        return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
      }
    });
    this.dataSource.data = [...this.listaOriginal];
  }

  resetearFiltros() {
    this.filtroAlmacen = '';
    this.filtroTipo = '';
    this.dataSource.filter = '';
    this.dataSource.data = [...this.listaOriginal];
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editar(movimiento: MovimientosTabla): void {
    const dialogRef = this.dialog.open(DialogEditarMovimientosComponent, {
      width: '980px',
      data: movimiento
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDatos();
      }
    });
  }

  eliminar(movimiento: MovimientosTabla) {
    const dialogRef = this.dialog.open(DialogEliminarMovimientoComponent, {
      width: '400px',
      data: movimiento
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }

  generarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Movimientos', 14, 20);
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 35);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Trabajador', 'Almacén', 'Tipo', 'Fecha']],
      body: this.listaOriginal.map(m => [
        m.IDMovimiento,
        m.NombreTrabajador,
        m.NombreAlmacen,
        m.TipoMovimiento,
        m.Fecha
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 122, 204] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save('Movimientos.pdf');
  }

  generarPDFIndividual(movimiento: any) {
  if (!movimiento) {
    console.error('No se recibió el movimiento');
    return;
  }

  // Inicializar jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Configuración
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let currentY = 20;

  // 1. ENCABEZADO
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`DETALLE DE MOVIMIENTO #${movimiento.IDMovimiento || movimiento.idMovimiento || ''}`, margin, currentY);
  currentY += 10;
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, margin + pageWidth, currentY);
  currentY += 15;

  // 2. INFORMACIÓN BÁSICA
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const infoLeft = [
    `Fecha: ${movimiento.Fecha || movimiento.fechaMovimiento?.split('T')[0] || ''}`,
    `Trabajador: ${movimiento.NombreTrabajador || movimiento.trabajador?.nombreTrabajador || ''}`
  ];
  
  const infoRight = [
    `Tipo: ${movimiento.TipoMovimiento || movimiento.tipoMovimiento?.tipoMovimientoDes || ''}`,
    `Almacén: ${movimiento.NombreAlmacen || movimiento.almacen?.nombreAlmacen || ''}`
  ];
  
  infoLeft.forEach((text, i) => doc.text(text, margin, currentY + (i * 7)));
  infoRight.forEach((text, i) => doc.text(text, margin + 100, currentY + (i * 7)));
  currentY += 20;

  // 3. TABLA DE DETALLES CON COSTOS
  const detalles = movimiento.Detalles || movimiento.detalles || [];
  let totalGeneral = 0;

  if (detalles.length > 0) {
    // Configuración de la tabla
    const columnHeaders = ['Material', 'Cantidad', 'P. Unitario', 'Costo Total'];
    const columnWidths = [90, 25, 35, 30];
    
    // Procesar cada detalle
    const tableData = detalles.map((d: any) => {
      const nombreMaterial = d.NombreMaterial || 
                           d.nombreMaterial || 
                           d.material?.nombre || 
                           d.material?.nombreMaterial || 
                           'Sin especificar';

      const cantidad = Number(d.Cantidad || d.cantidad) || 0;
      const precioUnitario = Number(d.CostoUnitario || d.costoUnitario) || 0;
      const costoTotal = cantidad * precioUnitario;
      totalGeneral += costoTotal;

      return [
        nombreMaterial,
        cantidad.toString(),
        `$${precioUnitario.toFixed(2)}`,
        `$${costoTotal.toFixed(2)}`
      ];
    });

    // Generar tabla - FORMA CORRECTA de llamar autoTable
    autoTable(doc, {
      startY: currentY,
      head: [columnHeaders],
      body: tableData,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1], halign: 'right' },
        2: { cellWidth: columnWidths[2], halign: 'right' },
        3: { cellWidth: columnWidths[3], halign: 'right', fontStyle: 'bold' }
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        overflow: 'linebreak'
      }
    });

    // Agregar total general
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `TOTAL GENERAL: $${totalGeneral.toFixed(2)}`,
      margin + pageWidth - 10,
      finalY,
      { align: 'right' }
    );
  } else {
    doc.setFontSize(12);
    doc.text('No se registraron detalles para este movimiento', margin, currentY);
  }

  // Pie de página
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `Generado el ${new Date().toLocaleDateString()}`,
    margin,
    doc.internal.pageSize.getHeight() - 10
  );

  // Guardar PDF
  const fileName = `MOV_${movimiento.IDMovimiento || movimiento.idMovimiento || '0'}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

  nuevo() {
    const dialogRef = this.dialog.open(DialogRegistrarMovimientoComponent, {
      width: '980px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }
}