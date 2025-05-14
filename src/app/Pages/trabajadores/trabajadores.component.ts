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
import { DialogRegistrarTrabajadorComponent } from '../dialog-registrar-trabajador/dialog-registrar-trabajador.component';
import { DialogEditarTrabajadorComponent } from '../dialog-editar-trabajador/dialog-editar-trabajador.component';
import { DialogEliminarTrabajadorComponent } from '../dialog-eliminar-trabajador/dialog-eliminar-trabajador.component';
import { AuthService } from '../../Services/Auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [
    CommonModule, 
    MatPaginatorModule, MatTableModule, MatButtonModule, MatCardModule,
    MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, FormsModule, MatDividerModule, MatDialogModule
  ],
  templateUrl: './trabajadores.component.html',
  styleUrl: './trabajadores.component.css'
})
export class TrabajadoresComponent implements OnInit, AfterViewInit {
  
  private TrabajadorServicio = inject(TrabajadoresService);
  displayedColumns: string[] = ['NombreTrabajador', 'Zona', 'Area', 'accion'];
  dataSource = new MatTableDataSource<TrabajadoresTabla>([]);
  listaOriginal: TrabajadoresTabla[] = [];

  zonas: any[] = [];
  areas: any[] = [];
  trabajadores: any[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtroZona: string = '';
  filtroArea: string = '';
  userRole: string = '';
  

  constructor(private router: Router, private dialog: MatDialog) { }

  async cargarDatos() {
    try {
        // Cargar trabajadores primero
        this.TrabajadorServicio.lista().subscribe({
            next: (data) => {
                console.log("Trabajadores recibidos:", data);
                this.trabajadores = data;

                this.listaOriginal = this.trabajadores.map(t => ({
                    IDTrabajador: t.idTrabajador,  
                    NombreTrabajador: t.nombreTrabajador, 
                    Zona: t.zona,  
                    Area: t.area   
                }));

                this.dataSource.data = this.listaOriginal;
            },
            error: (err) => console.error("Error al obtener Trabajadores:", err.message)
        });

        // Cargar zonas y áreas
        this.zonas = await this.TrabajadorServicio.obtenerZonas().toPromise() ?? [];
        this.areas = await this.TrabajadorServicio.obtenerAreas().toPromise() ?? [];

    } catch (error) {
        console.error("Error al cargar datos:", error);
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

  getZonaNombre(idZona: number | string): string {

    // Convertir a número para evitar errores
    const idZonaNum = Number(idZona);
    const zona = this.zonas.find(z => Number(z.idZona) === idZonaNum);

    if (!zona) {
      console.warn(`Zona con ID ${idZona} no encontrada en la lista.`);
    } else {
      console.log(`Zona encontrada: ${zona.nombreZona}`);
    }

    return zona ? zona.nombreZona : 'Desconocida';
  }

  getAreaNombre(idArea: number | string): string {
    console.log(`Buscando área para ID: ${idArea}`);
    console.log("Áreas disponibles:", this.areas);

    // Convertir a número para evitar errores
    const idAreaNum = Number(idArea);
    const area = this.areas.find(a => Number(a.idArea) === idAreaNum);

    if (!area) {
      console.warn(`Área con ID ${idArea} no encontrada en la lista.`);
    } else {
      console.log(`Área encontrada: ${area.nombreArea}`);
    }

    return area ? area.nombreArea : 'Desconocida';
  }

  aplicarFiltro(event: Event) {
    const filtroValor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filtroValor;
  }

  ordenar(direccion: 'asc' | 'desc') {
    this.dataSource.data = [...this.dataSource.data].sort((a, b) => {
      return direccion === 'asc'
        ? a.NombreTrabajador.localeCompare(b.NombreTrabajador)
        : b.NombreTrabajador.localeCompare(a.NombreTrabajador);
    });
  }

  filtrarPorZona() {
    if (this.filtroZona) {
        this.dataSource.data = this.listaOriginal.filter(t => t.Zona === this.filtroZona);
    } else {
        this.dataSource.data = this.listaOriginal;
    }
}

filtrarPorArea() {
    if (this.filtroArea) {
        this.dataSource.data = this.listaOriginal.filter(t => t.Area === this.filtroArea);
    } else {
        this.dataSource.data = this.listaOriginal;
    }
}

  resetearFiltros() {
    this.filtroZona = '';
    this.filtroArea = '';
    this.dataSource.data = this.listaOriginal;
  }

  nuevo() {
    const dialogRef = this.dialog.open(DialogRegistrarTrabajadorComponent, {
      width: '400px'
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos(); // Recargar datos solo si se agregó
    });
  }
  
  editar(objeto: TrabajadoresTabla) {
    const dialogRef = this.dialog.open(DialogEditarTrabajadorComponent, {
      width: '400px',
      data: objeto
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }
  
  eliminar(objeto: TrabajadoresTabla) {
    const dialogRef = this.dialog.open(DialogEliminarTrabajadorComponent, {
      width: '400px',
      data: objeto
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
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
      const doc = new jsPDF();
  
      // Agregar el logo a la esquina superior derecha
      doc.addImage(logoBase64, 'PNG',  170, 5, 30, 25); // Tamaño y posición del logo
  
      const Y_OFFSET = 5; // Desplazamiento hacia abajo para el contenido
  
      // Encabezado del documento
      doc.setFontSize(18);
      doc.text('Reporte de Trabajadores', 14, 20 + Y_OFFSET);
      
      // Línea de separación
      doc.setLineWidth(0.5);
      doc.line(10, 25 + Y_OFFSET, 200, 25 + Y_OFFSET);
  
      // Espacio antes de la tabla
      doc.setFontSize(12);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 35 + Y_OFFSET);
      
      // GENERAR LA TABLA AUTOMÁTICA
      autoTable(doc, {
        startY: 40 + Y_OFFSET, // Desplazar la tabla hacia abajo
        head: [['ID', 'Nombre', 'Zona', 'Área']],
        body: this.listaOriginal.map(t => [t.IDTrabajador, t.NombreTrabajador, t.Zona, t.Area]),
        theme: 'grid',
        headStyles: { fillColor: [0, 122, 204] }, // Azul
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Gris claro
        margin: { top: 40 + Y_OFFSET, left: 10, right: 10 },
      });
  
      // DESCARGAR EL PDF
      doc.save('Trabajadores.pdf');
    };
  }
}  