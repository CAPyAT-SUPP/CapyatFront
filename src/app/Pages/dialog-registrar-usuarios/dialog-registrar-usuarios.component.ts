import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioRegistro } from '../../Models/Usuarios';
import { Rol } from '../../Models/Roles';
import { Trabajadores } from '../../Models/Trabajadores';
import { UsuariosService } from '../../Services/usuarios.service';
import { RolesService } from '../../Services/roles.service';
import { TrabajadoresService } from '../../Services/trabajadores.service';
import { CommonModule, NgIf, NgForOf } from '@angular/common';


@Component({
  selector: 'app-dialog-registrar-usuarios',
  standalone: true,
  templateUrl: './dialog-registrar-usuarios.component.html',
  styleUrls: ['./dialog-registrar-usuarios.component.css'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    NgIf,
    NgForOf
  ]
})
export class DialogRegistrarUsuariosComponent implements OnInit {

  form: FormGroup;
  roles: Rol[] = [];
  trabajadores: any[] = [];

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesService);
  private trabajadoresService = inject(TrabajadoresService);
  private dialogRef = inject(MatDialogRef<DialogRegistrarUsuariosComponent>);
  

  constructor() {
    this.form = this.fb.group({
      nombreUs: ['', Validators.required],
      correoUs: ['', [Validators.required, Validators.email]],
      contraUs: ['', Validators.required],
      idRol: [null, Validators.required],
      idTrabajador: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarTrabajadores();
  }

  cargarRoles(): void {
    this.rolesService.lista().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
      }
    });
  }

  cargarTrabajadores(): void {
    this.trabajadoresService.lista().subscribe({
      next: (data) => {
        console.log('Trabajadores recibidos:', data);
        this.trabajadores = data;
      },
      error: (err) => {
        console.error('Error al cargar trabajadores:', err);
      }
    });
  }  

  guardar(): void {
    if (this.form.invalid) return;
  
    const usuario: UsuarioRegistro = {
      idUsuario: 0,
      NombreUs: this.form.value.nombreUs,
      CorreoUs: this.form.value.correoUs,
      ContraUs: this.form.value.contraUs,
      IDRol: this.form.value.idRol,
      IDTrabajador: this.form.value.idTrabajador
    };
  
    // 👉 Aquí está el log que debes agregar
    console.log('Usuario a registrar:', usuario);
  
    this.usuariosService.registrar(usuario).subscribe({
      next: (res) => {
        if (res.estado) {
          this.dialogRef.close(true);
        } else {
          console.warn('Registro fallido:', res.mensaje);
        }
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        console.error('Detalles del error:', err.error); // Para ver el mensaje que manda el backend
      }
    });
  }
  

  cancelar(): void {
    this.dialogRef.close();
  }
}
