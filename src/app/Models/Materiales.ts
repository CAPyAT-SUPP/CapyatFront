export interface Materiales {
    IDMaterial?: number;
    NombreMaterial: string;
    DescripcionMaterial: string;
    CantidadMaterial: number;
    CostoUnitario: number;
    CostoTotal?: number; 
    Descuento: number;
    IVA: number;
    StockActual: number;
    Imagen?: Uint8Array | string | null;
    IDCategoria: number;
    IDProveedor: number;
  }
  

export interface MaterialesTabla{
    IDMaterial: number;
    NombreMaterial: string;
    DescripcionMaterial: string;
    CantidadMaterial: number;
    CostoUnitario: number;
    CostoTotal: number;
    Descuento: number;
    IVA: number;
    StockActual: number;
    Imagen?: Uint8Array | string | null;
    IDCategoria: number;
    IDProveedor: number;
}