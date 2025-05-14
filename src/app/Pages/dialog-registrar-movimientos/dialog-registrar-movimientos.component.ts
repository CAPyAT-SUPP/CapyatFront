import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MovimientoService } from '../../Services/movimientos.service';
import { MaterialesService } from '../../Services/materiales.service';
import { TrabajadoresService } from '../../Services/trabajadores.service';
import { AlmacenService } from '../../Services/Almacen.service';
import { TipoMovimientoService } from '../../Services/Tipo-movimineto.service';

@Component({
  selector: 'app-dialog-registrar-movimientos',
  standalone: true,
  templateUrl: './dialog-registrar-movimientos.component.html',
  styleUrls: ['./dialog-registrar-movimientos.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule
  ]
})
export class DialogRegistrarMovimientoComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>; // Referencia a la tabla
  displayedColumns: string[] = ['material', 'cantidad', 'costoUnitario', 'costoTotal', 'acciones'];
  movimientoForm!: FormGroup;

  materialesDisponibles: any[] = [];
  trabajadores: any[] = [];
  almacenes: any[] = [];
  tiposMovimiento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogRegistrarMovimientoComponent>,
    private movimientoService: MovimientoService,
    private materialesService: MaterialesService,
    private trabajadorService: TrabajadoresService,
    private almacenService: AlmacenService,
    private tipoMovimientoService: TipoMovimientoService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.movimientoForm.patchValue(this.data);  // Si estás editando, carga los datos en el formulario
    }
    this.cargarDatosIniciales();
  }

  initForm(): void {
    this.movimientoForm = this.fb.group({
      IDTipoMovimiento: [null, Validators.required],
      FechaMovimiento: [new Date(), Validators.required],
      IDTrabajador: [null, Validators.required],
      IDAlmacen: [null, Validators.required],
      detalles: this.fb.array([this.crearDetalleFormGroup()])
    });
  }

  get detalles(): FormArray {
    return this.movimientoForm.get('detalles') as FormArray;
  }

  crearDetalleFormGroup(): FormGroup {
    return this.fb.group({
      IDMaterial: [null, Validators.required],
      Cantidad: [null, [Validators.required, Validators.min(1)]],
      CostoUnitario: [null],
      CostoTotal: [null],
      error: [false]
    });
  }

  cargarDatosIniciales(): void {
    this.materialesService.lista().subscribe(res => this.materialesDisponibles = res);
    this.trabajadorService.lista().subscribe(res => this.trabajadores = res);
    this.almacenService.lista().subscribe(res => this.almacenes = res);
    this.tipoMovimientoService.lista().subscribe(res => this.tiposMovimiento = res);
  }

  agregarDetalle(): void {
    this.detalles.push(this.crearDetalleFormGroup());
    this.table.renderRows(); // Actualiza la tabla
  }

  eliminarDetalle(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
      this.table.renderRows(); // Actualiza la tabla al eliminar
    }
  }

  materialYaSeleccionado(idMaterial: number): boolean {
    return this.detalles.controls.some(
      (detalle) => detalle.get('IDMaterial')?.value === idMaterial
    );
  }

  eliminarMovimiento(idMovimiento: number): void {
    // Confirmación de eliminación
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      this.movimientoService.eliminar(idMovimiento).subscribe({
        next: (response) => {
          // Si la eliminación es exitosa, puedes cerrar el diálogo y mostrar un mensaje
          this.snackBar.open('Movimiento eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);  // Cierra el diálogo con resultado exitoso
        },
        error: (err) => {
          console.error('Error al eliminar movimiento:', err);
          this.snackBar.open('Error al eliminar movimiento. Intenta nuevamente.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  onSeleccionMaterial(detalle: FormGroup, idMaterial: number, index: number): void {
    const yaSeleccionado = this.detalles.controls.some(
      (d, i) => d.get('IDMaterial')?.value === idMaterial && i !== index
    );

    if (yaSeleccionado) {
      detalle.patchValue({
        IDMaterial: null,
        CostoUnitario: null,
        CostoTotal: null,
        error: 'material_duplicado'
      });
      return;
    }

    const material = this.materialesDisponibles.find(m => m.idMaterial === idMaterial);
    if (material) {
      detalle.patchValue({
        IDMaterial: idMaterial,
        CostoUnitario: material.costoUnitario,
        error: null
      });
      this.actualizarCantidad(detalle);
    }
  }

  actualizarCantidad(detalle: FormGroup): void {
    const cantidad = detalle.get('Cantidad')?.value;
    const costoUnitario = detalle.get('CostoUnitario')?.value;

    if (cantidad <= 0) {
      detalle.patchValue({
        error: 'cantidad_invalida',
        CostoTotal: 0
      });
    } else {
      detalle.patchValue({
        CostoTotal: cantidad * costoUnitario,
        error: null
      });
    }
  }

  obtenerImporteTotal(): number {
    return this.detalles.controls
      .filter(d => !d.get('error')?.value && d.get('IDMaterial')?.value)
      .reduce((total, item) => total + (item.get('CostoTotal')?.value || 0), 0);
  }

  guardar(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched();
      return;
    }

    const detallesValidos = this.detalles.controls
      .filter(d => d.get('IDMaterial')?.value && !d.get('error')?.value && d.get('Cantidad')?.value > 0);

    if (detallesValidos.length === 0) {
      this.snackBar.open('Agrega materiales válidos antes de guardar.', 'Cerrar', { duration: 3000 });
      return;
    }

    const payload = {
      ...this.movimientoForm.value,
      detalles: detallesValidos.map(d => d.value)
    };

    this.movimientoService.registrar(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        console.error('Error al guardar movimiento:', err);
        this.snackBar.open('Error al guardar movimiento. Intenta nuevamente.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}