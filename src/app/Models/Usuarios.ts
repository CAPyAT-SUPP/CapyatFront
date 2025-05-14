export interface Usuario {
    idUsuario: number;
    nombreUs: string;
    correoUs: string;
    contraUs: string;
    idRol: number;
    NombreRol: string;        
    idTrabajador: number;
    nombreTrabajador: string;
  }
  
  
  export interface Rol {
    idRol: number;
    nombreRol: string;
    descripcion: string;
  }
  

  export interface UsuarioTabla {
    idUsuario: number;
    nombreUsuario: string;
    correoUsuario: string;
    contrasenaUsuario: string;
    nombreRol: string; 
  }

  export interface UsuarioRegistro {
    idUsuario: number;
    NombreUs: string;    // Cambiado de nombreUs
    CorreoUs: string;    // Cambiado de correoUs
    ContraUs: string;    // Cambiado de contraUs
    IDRol: number;       // Cambiado de idRol
    IDTrabajador: number;// Cambiado de idTrabajador
  }

  