export interface Movimientos {
    IDMovimiento?: number;
    fechaMovimiento: Date;
    tipoMovimiento: TipoMovimiento;
    almacen: Almacen;
    trabajador: Trabajador;
    detalles: DetalleMovimiento[];
  }
  
  export interface TipoMovimiento {
    idTipoMovimiento: number;
    tipoMovimientoDes: string;
  }
  
  export interface Almacen {
    idAlmacen: number;
    nombreAlmacen: string;
  }
  
  export interface Trabajador {
    idTrabajador: number;
    nombreTrabajador: string;
  }
  
  export interface DetalleMovimiento {
    idDetalleMovimiento?: number;
    idMaterial: number;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
  }
  
  export interface MovimientosTabla {
    IDMovimiento: number;
    NombreTrabajador: string;
    NombreAlmacen: string;
    TipoMovimiento: string;
    Fecha: string;
  }
  