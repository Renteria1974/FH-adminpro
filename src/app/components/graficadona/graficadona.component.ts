// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit, Input } from '@angular/core';

// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-graficadona',                 // Etiqueta final donde se va a cargar este componente
  templateUrl: './graficadona.component.html'  // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class GraficadonaComponent implements OnInit
{
  // Propiedades para el gráfico, usadas por "ng2-chart"
  // "@Input()"   = Decorador
  // El valor de estas propiedades se recibe desde afuera del componente, del componente "graficas1.component.ts" que es su componente PADRE
  @Input('chartLabels') public doughnutChartLabels: string[] = [];
  @Input('chartData') public doughnutChartData: number[] = [];
  @Input('chartType') public doughnutChartType: string = '';


  // Hacemos "responsive" al gráfico
  public barChartOptions: any =
  {
    responsive: true
  };


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor()
  {

  }


  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
  }

}
