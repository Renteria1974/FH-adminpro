// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, DoCheck, Inject, Renderer2, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// SERVICIOS CREADOS POR NOSOTROS
import { SettingsService } from '../../services/service.index';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-account-settings',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './account-settings.component.html'   // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class AccountSettingsComponent implements AfterViewInit, DoCheck
{
  // "@ViewChildren" = Nos permite obtener todos los elementos que existan en nuestro template que sean del tipo que usamos como selector.
  // El tipo devuelto es del tipo "QueryList", el cual es resuelto antes del hook "ngafterViewInit"
  // Podemos subscribirnos al "Observable" que nos proporciona la propiedad "changes" para obtener los resultados de la búsqueda
  @ViewChildren('selector') todosMisTemas: QueryList<ElementRef>;

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
      // "@Inject" = Es un mecanismo manual para que Angular sepa que se debe inyectar algo, en este caso se inyecta el
      // DOM para aquellos casos como un "web worker" en los que no está disponible
      @Inject(DOCUMENT) private _document,

      public _ajustes: SettingsService,
      private renderer: Renderer2 )
  {}


  // Se llama una única vez, tras inicializar las vistas y subvistas del componente
  // De igual forma se ejecuta después del "@ViewChildren"
  ngAfterViewInit ()
  {
     this.colocarCheck();   // Colocamos el "check" en el tema que se tiene seleccionado en la configuración
  }


  // Se ejecuta cuando se hace algun cambio en el componente, o se produce un evento dentro del componente
  // o algun tipo de cambio dentro de la directiva. Se ejecuta despues del "ngOnInit", se lanza cuantas veces haya cambios en el componente
  ngDoCheck()
  {
    // this.renderer.setAttribute(document.getElementById('tema'), 'href', this._ajustes.ajustes.temaUrl);
    this.renderer.setAttribute(this._document.getElementById('tema'), 'href', this._ajustes.ajustes.temaUrl);
  }


  // Método para cambiar el color de fondo del Encabezado del Menú Principal
  // "tema" = Cadena que indica el tema de fondo del Encabezado del Menú principal
  // "link" = Hace referencia directa al elemento seleccionado (en este caso es el elemento: <a></a>)
  cambiarColor( tema: string, link: ElementRef )
  {
    // Hacemos el llamado al método "aplicarcheck" con el argumento "link"
    this.aplicarCheck( link );

    //  Mandamos llamar al método "aplicarTema" que tenemos en el archivo "settings.service.ts"
    // para aplicar la nueva configuración del Menú Prncipal
    this._ajustes.aplicarTema( tema );

    // "this.renderer" = travez el "renderer" afctamos directamente al DOM
    // ".setAttribute" = Asignamos un atributo al elemento del DOM
    // "this._document.getElementById('tema')" = Elemento del DOM a afectar con el ID especificado
    // "href" = Nombre del elemento del DOM
    // "this._ajustes.ajustes.temaUrl" = Valor a asignar
    this.renderer.setAttribute(this._document.getElementById('tema'), 'href', this._ajustes.ajustes.temaUrl);
  }


  // Método para marcar con un "check" el color de fondo que se está seleccionando para usarse en el Encabezado del Menú Principal
  aplicarCheck( link: ElementRef )
  {
    // "let theme: ElementRef"   = Variable del tipo "ElementRef"
    // "this.todosMisTemas.find" = Hacemos una búsqueda en el QueryList "todosMisTemas"
    // "ref => ref.nativeElement.classList.contains('working')" = Se recibe como parámetro el elemento del DOM (ref)
    //             se localiza aquel que tenga la clase "working"
    let theme: ElementRef = this.todosMisTemas.find(ref => ref.nativeElement.classList.contains('working'));

    // En caso de que la variable "theme" tenga valor
    if (theme)
    {
      // Se remueve laclase "working" al elemento del DOM que actualmente la tiene
      this.renderer.removeClass(theme.nativeElement, 'working' );
    }
    // Se agrega la clase "working" al elemento del DOM que se acaba de seleccionar (en este caso es el elemento: <a></a>)
    this.renderer.addClass( link, 'working' );
  }


  // Método para colocarle el "check" (palomilla) al tema que se tiene seleccionado en la configuración del Encabezado del Menú Principal
  colocarCheck()
  {
    // Variable que contendrá el nombre del tema que se tiene seleccionado actualmente
    let tema = this._ajustes.ajustes.tema;

    // "let theme: ElementRef"   = Variable del tipo "ElementRef"
    // "this.todosMisTemas.find" = Hacemos una búsqueda en el QueryList "todosMisTemas"
    // "ref => ref.nativeElement.getAttribute('data-theme') === tema" = Se recibe como parámetro el elemento del DOM (ref)
    //             se localiza aquel cuyo atributo "data-theme" tenga el mismo valor que nuestra variable "tema"
    let theme: ElementRef = this.todosMisTemas.find(ref => ref.nativeElement.getAttribute('data-theme') === tema);

    // En caso de que la variable "theme" tenga valor
    if (theme)
    {
      // Se agrega la clase "working" al elemento del DOM que se acaba de seleccionar (en este caso es el elemento: <a></a>)
      this.renderer.addClass(theme.nativeElement, 'working' );
    }
  }

}
