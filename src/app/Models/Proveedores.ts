export interface Proveedores {
    IDProveedor?: number;
    nombreProveedor: string;
    claveProveedor: string;
    calleProveedor: string;
    noIntProveedor: number | null;
    noExtProveedor: number | null;
    coloniaProveedor: string;
    cp: number | null;
    estado: string;
    municipio: string;
    rfc: string;
}

export interface ProveedoresTabla{
    IDProveedor?: number;
    NombreProveedor: string;
    ClaveProveedor: string;
    CalleProveedor: string;
    NoIntProveedor: number;
    NoExtProveedor: number;
    ColoniaProveedor: string;
    CP: number;
    Estado: string;
    Municipio: string;
    RFC: string;
}