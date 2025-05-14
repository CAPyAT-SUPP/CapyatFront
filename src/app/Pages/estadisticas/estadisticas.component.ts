import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../Services/estadisticas.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    NgChartsModule,
    MatTooltipModule,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    FormsModule,
    MatMomentDateModule
  ],
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  // Inicialización de propiedades
  costoTotalInventario: number = 0;
  movimientosPorPeriodo: any[] = [];
  costoTotalPorAlmacen: any[] = [];
  totalMaterialesPorAlmacen: any[] = [];
  dataCostoAlmacen: any[] = [];
  loading: boolean = true;

  public labelsMaterialesAlmacen: string[] = [];

  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();

  public entradasEntreFechas: any[] = [];  // Asegúrate de que esto está inicializado correctamente


  // Gráfica de barras (Entradas/Salidas)
  public barChartLabels: string[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  // Gráfica de pastel (Costo total por almacén)
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartDataFormatted: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  // Gráfica de dona (Materiales por almacén)
  public materialesAlmacenChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  constructor(private estadisticasservice: EstadisticasService) { }

  ngOnInit(): void {
    // Inicialización de las funciones al cargar el componente
    this.getCostoTotalInventario();
    this.getMovimientosPorPeriodo();
    this.getCostoTotalPorAlmacen();
    this.getTotalMaterialesPorAlmacen();
    this.entradasEntreFechas = []; // Asegura que siempre sea un arreglo vacío
  }

  // Obtiene el costo total del inventario
  getCostoTotalInventario(): void {
    this.estadisticasservice.obtenerCostoTotalInventario().subscribe(data => {
      this.costoTotalInventario = data.costoTotal;
    });
  }


  // Obtiene los movimientos por periodo
  getMovimientosPorPeriodo(): void {
    this.estadisticasservice.obtenerMovimientosPorPeriodo().subscribe(data => {
      this.movimientosPorPeriodo = data;
      this.barChartLabels = data.map(item => item.Periodo);
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          { data: data.map(item => item.Entradas), label: 'Entradas' },
          { data: data.map(item => item.Salidas), label: 'Salidas' }
        ]
      };
    });
  }

  // Obtiene el costo total por almacén
  getCostoTotalPorAlmacen(): void {
    this.estadisticasservice.obtenerCostoTotalPorAlmacen().subscribe(data => {
      this.costoTotalPorAlmacen = data;
      this.pieChartLabels = data.map(item => item.zona);
      this.pieChartData = data.map(item => item.costoTotal);
      this.pieChartDataFormatted = {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: this.pieChartData,
            label: 'Costo Total por Almacén',
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
          },
        ],
      };
    });
  }

  // Obtiene el total de materiales por almacén
  getTotalMaterialesPorAlmacen(): void {
    this.estadisticasservice.obtenerTotalMaterialesPorAlmacen().subscribe(data => {
      this.totalMaterialesPorAlmacen = data;
      const labels = data.map(item => item.zona);
      const cantidades = data.map(item => item.totalMateriales);

      this.materialesAlmacenChartData = {
        labels,
        datasets: [
          {
            data: cantidades,
            backgroundColor: ['#FFA500', '#00CED1', '#9370DB', '#3CB371']
          }
        ]
      };
    });
  }

  // Consulta las entradas entre fechas
  consultarEntradas(): void {
    this.estadisticasservice.obtenerMovimientosPorPeriodo().subscribe(data => {
      this.entradasEntreFechas = data || [];
      console.log(this.entradasEntreFechas);
    });
  }
}
