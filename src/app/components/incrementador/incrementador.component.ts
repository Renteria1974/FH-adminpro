// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-incrementador',                 // Etiqueta final donde se va a cargar este componente
  templateUrl: './incrementador.component.html'  // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class IncrementadorComponent implements OnInit
{
  // "@ViewChild() = Decorador
  // 'txtProgress' = Parámetro que se recibe, es una referencia al elemento HTML que deseamos manejar
  // txtprogress   = Nombre que le vamos a dar para poder manejarlo aquí con TypeScript
  // ElementRef    = Es el tipo de datos
  @ViewChild('txtProgress') txtProgress: ElementRef;


  // "@Input()"   = Decorador
  // El valor de estas propiedades se recibe desde afuera del componente
  // El valor que se les da aquí es el valor por defecto que tendrán
  // 'nombre' = Es el nombre que la variable tiene en el componente padre (progress.component)
  @Input('nombre') public leyenda: string = 'Leyenda';    // Leyenda de la barra de progreso
  @Input() public progreso: number = 50;                  // Valor de la barra de progreso

  // "@Output()"   = Decorador
  // "cambioValor" = Propiedad que se autoinstancia de un objeto "EventEmitter", es decir, "enviado" va a poder emitir eventos
                // es decir, estamos generando un evento
  // "<number>"    = se va a emitir un número
  @Output() cambioValor: EventEmitter<number> = new EventEmitter();



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


  // Método para cambiar el valor de la Barra de Progreso
  cambiarValor( valor: number )
  {
    this.progreso = this.progreso + valor;

    if ( this.progreso >= 100 && valor > 0) { this.progreso = 100; }

    if ( this.progreso <= 0 && valor < 0 ) { this.progreso = 0; }

    // Emitimos el evento, enviamos el valor de la variable "progreso"
    this.cambioValor.emit( this.progreso );

    // Para poner el foco en el campo "input" de la barra de botones
    this.txtProgress.nativeElement.focus();
  }


  // Método que recibe el nuevo valor del campo "txtProgress" que a su ves está enlazado a la propiedad "progreso"
  onChanges( nuevoValor: number )
  {
    // Declaramos una variable del tipo de elemento del documento HTML, en este caso el campo "input" lamado "progreso"
    // la declaramos del tipo "any" para que no marque error al usar su propiedad "value"
    // Indicamos que queremos la posición "0" porque se regresa un array y sólo requerimos el primer elemento
    // let elemHTML: any = document.getElementsByName('progreso')[0];

    if ( nuevoValor >= 100 )
    {
      this.progreso = 100;
    }
    else if ( nuevoValor <= 0 )
    {
      this.progreso = 0;
    }
    else
    {
      this.progreso = nuevoValor;
    }

    // Al elemento HTML le asignamos el valor de la variable "progreso" para que no pueda mostrar más dígitos
    // elemHTML.value = this.progreso;

    // Con esto nos aseguramos que cuando tecleamos un valor en el input "progreso" se modificará el valor de la barra de progreso adecuada
    // es decir, podemos tener varias referencias al componente "incrementador.component" y no tendremos ningun problema
    this.txtProgress.nativeElement.value = this.progreso;

    // Emitimos el evento, enviamos el valor de la variable "progreso"
    this.cambioValor.emit( this.progreso );
  }

}
