export interface DetalleMovimientoDTO {
    IDDetalle: number;
    IDMaterial: number;
    NombreMaterial: string;
    Cantidad: number;
    CostoUnitario: number;
  }
  
  export interface MovimientoConDetallesDTO {
    IDMovimiento: number;
    Fecha: string;
    TipoMovimiento: string;
    IDTrabajador: number;
    IDAlmacen: number;
    Detalles: DetalleMovimientoDTO[];
  }
  