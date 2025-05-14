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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dialog-editar-movimientos',
  standalone: true,
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
  ],
  templateUrl: './dialog-editar-movimientos.component.html',
  styleUrls: ['./dialog-editar-movimientos.component.css']
})
export class DialogEditarMovimientosComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumns: string[] = ['material', 'cantidad', 'costoUnitario', 'costoTotal', 'acciones'];
  movimientoForm!: FormGroup;

  materialesDisponibles: any[] = [];
  trabajadores: any[] = [];
  almacenes: any[] = [];
  tiposMovimiento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogEditarMovimientosComponent>,
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
    this.cargarDatosIniciales();

    // Cargar datos del movimiento a editar
    if (this.data) {
      this.cargarMovimiento(this.data);
    }
  }

  initForm(): void {
    this.movimientoForm = this.fb.group({
      IDMovimiento: [null],
      IDTipoMovimiento: [null, Validators.required],
      FechaMovimiento: [new Date(), Validators.required],
      IDTrabajador: [null, Validators.required],
      IDAlmacen: [null, Validators.required],
      detalles: this.fb.array([])  // Este es el FormArray donde se agregan los detalles
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

  cargarDatosIniciales(): Promise<void> {
    return new Promise((resolve) => {
      forkJoin([
        this.materialesService.lista(),
        this.trabajadorService.lista(),
        this.almacenService.lista(),
        this.tipoMovimientoService.lista()
      ]).subscribe(([materiales, trabajadores, almacenes, tipos]: [any[], any[], any[], any[]]) => {
        this.materialesDisponibles = materiales;
        this.trabajadores = trabajadores;
        this.almacenes = almacenes;
        this.tiposMovimiento = tipos;
        resolve();
      });
    });
  }

  cargarMovimiento(movimiento: any): void {
    this.cargarDatosIniciales();

    console.log('Cargando movimiento:', movimiento);


    // Cargar los datos principales del movimiento
    this.movimientoForm.patchValue({
      IDTipoMovimiento: movimiento.IDTipoMovimiento || movimiento.idTipoMovimiento,
      FechaMovimiento: new Date(movimiento.FechaMovimiento || movimiento.fechaMovimiento),
      IDTrabajador: movimiento.IDTrabajador || movimiento.idTrabajador,
      IDAlmacen: movimiento.IDAlmacen || movimiento.idAlmacen,
      IDMovimiento: movimiento.IDMovimiento || movimiento.idMovimiento
    });


    this.detalles.clear();

    // Cargar detalles
    if (movimiento.Detalles && movimiento.Detalles.length > 0) {
      movimiento.Detalles.forEach((detalle: any) => {
        const material = this.materialesDisponibles.find(m =>
          m.idMaterial === (detalle.idMaterial || detalle.IDMaterial)
        );

        const detalleFormGroup = this.fb.group({
          IDDetalleMovimiento: [detalle.IDDetalleMovimiento || detalle.idDetalleMovimiento],
          IDMaterial: [detalle.idMaterial || detalle.IDMaterial, Validators.required],
          Cantidad: [detalle.cantidad || detalle.Cantidad, [Validators.required, Validators.min(1)]],
          CostoUnitario: [detalle.costoUnitario || detalle.CostoUnitario],
          CostoTotal: [detalle.costoTotal || detalle.CostoTotal],
          error: [false],
          nombreMaterial: [material?.nombreMaterial] // Guardar el nombre para mostrarlo
        });
        this.detalles.push(detalleFormGroup);
      });

      // Forzar la actualización de los selects
      setTimeout(() => {
        this.movimientoForm.updateValueAndValidity();
        if (this.table) {
          this.table.renderRows();
        }
      }, 0);
    }
  }

  agregarDetalle(): void {
    this.detalles.push(this.crearDetalleFormGroup());
    this.table.renderRows(); // Actualizar la tabla cuando se agrega un detalle
  }

  eliminarDetalle(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
      this.table.renderRows(); // Actualizar la tabla cuando se elimina un detalle
    }
  }

  materialYaSeleccionado(idMaterial: number): boolean {
    return this.detalles.controls.some(
      (detalle) => detalle.get('IDMaterial')?.value === idMaterial
    );
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

    this.movimientoService.editar(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        console.error('Error al editar movimiento:', err);
        this.snackBar.open('Error al editar movimiento. Intenta nuevamente.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  // Obtener nombre del tipo de movimiento seleccionado
  getTipoMovimientoNombre(id: number): string {
    const tipo = this.tiposMovimiento.find(t => t.idTipoMovimiento === id);
    return tipo ? tipo.tipoMovimientoDes : '';
  }

  // Obtener nombre del trabajador seleccionado
  getTrabajadorNombre(id: number): string {
    const trabajador = this.trabajadores.find(t => t.idTrabajador === id);
    return trabajador ? trabajador.nombreTrabajador : '';
  }

  // Obtener nombre del almacén seleccionado
  getAlmacenNombre(id: number): string {
    const almacen = this.almacenes.find(a => a.idAlmacen === id);
    return almacen ? almacen.nombreAlmacen : '';
  }
}

