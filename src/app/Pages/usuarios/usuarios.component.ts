import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuarioTabla } from '../../Models/Usuarios';
import { UsuariosService } from '../../Services/usuarios.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DialogRegistrarUsuariosComponent } from '../dialog-registrar-usuarios/dialog-registrar-usuarios.component';
import { DialogEditarUsuariosComponent } from '../dialog-editar-usuarios/dialog-editar-usuarios.component';
import { DialogEliminarUsuariosComponent } from '../dialog-eliminar-usuarios/dialog-eliminar-usuarios.component';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
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
  ]
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  private usuarioServicio = inject(UsuariosService);
  displayedColumns: string[] = ['nombreUs', 'correoUs', 'nombreRol', 'accion'];
  dataSource = new MatTableDataSource<UsuarioTabla>([]);
  listaOriginal: UsuarioTabla[] = [];

  roles: { idRol: string, nombreRol: string }[] = [];
  filtroRol: string = '';
  userRole: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private dialog: MatDialog) { }

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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarDatos(): void {
    this.usuarioServicio.lista().subscribe({
      next: (data) => {
        console.log('Datos del API:', data);

        this.listaOriginal = data.map((u: any) => ({
          idUsuario: u.idUsuario,
          nombreUsuario: u.nombreUs,          // 👈 Correcto
          correoUsuario: u.correoUs,           // 👈 Correcto
          contrasenaUsuario: u.contraUs,       // 👈 Correcto
          nombreRol: u.nombreRol ?? 'Sin rol'        // 👈 Correcto
        }));

        this.dataSource.data = this.listaOriginal;
      },
    });
  }

  aplicarFiltro(event: Event): void {
    const filtroValor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: UsuarioTabla, filter: string) => {
      const dataStr = `${data.nombreUsuario} ${data.correoUsuario} ${data.nombreRol}`.toLowerCase();
      return dataStr.includes(filter);
    };
    this.dataSource.filter = filtroValor;
  }

  filtrarPorRol(): void {
    if (this.filtroRol) {
      this.dataSource.data = this.listaOriginal.filter(u => u.nombreRol === this.filtroRol);
    } else {
      this.dataSource.data = this.listaOriginal;
    }
  }

  resetearFiltros(): void {
    this.filtroRol = '';
    this.dataSource.data = this.listaOriginal;
  }

  ordenar(direccion: 'asc' | 'desc'): void {
    this.dataSource.data = [...this.dataSource.data].sort((a, b) => {
      return direccion === 'asc'
        ? a.nombreUsuario.localeCompare(b.nombreUsuario)
        : b.nombreUsuario.localeCompare(a.nombreUsuario);
    });
  }

  nuevo(): void {
    const dialogRef = this.dialog.open(DialogRegistrarUsuariosComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }

  editar(usuario: UsuarioTabla): void {
    const dialogRef = this.dialog.open(DialogEditarUsuariosComponent, {
      width: '400px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }

  eliminar(usuario: UsuarioTabla): void {
    const dialogRef = this.dialog.open(DialogEliminarUsuariosComponent, {
      width: '400px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }

  generarPDF(): void {
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
      doc.addImage(logoBase64, 'PNG', 170, 5, 30, 25); // Tamaño y posición del logo
  
      const Y_OFFSET = 5; // Desplazamiento hacia abajo para el contenido
  
      // Encabezado del documento
      doc.setFontSize(18);
      doc.text('Reporte de Usuarios', 14, 20 + Y_OFFSET);
      
      // Línea de separación
      doc.setLineWidth(0.5);
      doc.line(10, 25 + Y_OFFSET, 200, 25 + Y_OFFSET);
  
      // Espacio antes de la tabla
      doc.setFontSize(12);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 35 + Y_OFFSET);
      
      // GENERAR LA TABLA AUTOMÁTICA
      autoTable(doc, {
        startY: 40 + Y_OFFSET, // Desplazar la tabla hacia abajo
        head: [['Nombre', 'Correo', 'Rol']],
        body: this.listaOriginal.map(u => [u.nombreUsuario, u.correoUsuario, u.nombreRol]),
        theme: 'grid',
        headStyles: { fillColor: [0, 122, 204] }, // Azul
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Gris claro
        margin: { top: 40 + Y_OFFSET, left: 10, right: 10 },
      });
  
      // DESCARGAR EL PDF
      doc.save('Usuarios.pdf');
    };
  }
}  