// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';

// Servicios creados por Nosotros
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
export class AccountSettingsComponent implements OnInit
{

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración

  // "@Inject(DOCUMENT)" = Hacemos referencia a todo el DOM
  // "private _document" = A la referencia del DOM la declaramos como propiedad privada llamada "_document"
  constructor( public _ajustes: SettingsService )
  {

  }


  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
     this.colocarCheck2();   // Colocamos el "check" en el tema que se tiene seleccionado en la configuración
  }


  // Método para cambiar el color de fondo del Menú Principal
  // "tema" = Cadena que indica el tema de fondo del menú principal
  // "link" = Hace referencia directa a elemento seleccionado
  cambiarColor( tema: string, link: any )
  {
    // Hacemos el llamado al método "aplicarcheck" con el argumento "link"
    this.aplicarCheck( link );

    //  Mandamos llamar al método "aplicarTema" que tenemos en el archivo "settings.service.ts"
    // para aplicar la nueva configuración del Menú Prncipal
    this._ajustes.aplicarTema( tema );
  }


  // Método para marcar con un "check" el color de fondo que se está seleccionando para usarse en el menú Principal
  aplicarCheck( link: any )
  {
    // Variable que realmente es un arreglo de todos los elementos del DOM que tengan la clase "working"
    // En este caso todos los enlaces "a" tienen dicha clase
    let selectores: any = document.getElementsByClassName('working');

    // "barremos" el arreglo para obtener cada elemento del arreglo de "selectores"
    for ( let ref of selectores )
    {
      // Vamos a remover cualquier clase que diga "working"
      ref.classList.remove('working');
    }

    // Al elemento seleccionado le agregamos la clase "working"
    link.classList.add('working');
  }


  // Método para colocarle el "check" al tema que se tiene seleccionado en la configuración del Menú
  colocarCheck()
  {
    // Variable que realmente es un arreglo de todos los elementos del DOM que tengan la clase "selector"
    // En este caso todos los enlaces "a" tienen dicha clase
    let selectores: any = document.getElementsByClassName('selector');

    // Variable que contendrá el nombre del tema que se tiene seleccionado actualmente
    let tema = this._ajustes.ajustes.tema;

    // "barremos" el arreglo para obtener cada elemento del arreglo de "selectores"
    for ( let ref of selectores )
    {
      // Verificamos si el selector actual en su atributo "data-theme" tiene el valor del tema que tenemos seleccionado actualmente
      if ( ref.getAttribute('data-theme') === tema  )
      {
        // Al selector actual le agregamos la clase "working"
        ref.classList.add('working');
        break;  // Salimos del ciclo "for" ya que sólo buscabamos una coincidencia y ya la encontramos
      }
    }

  }


  // Método que hace lo mismo que "colocarCheck" pero de forma más eficiente
  colocarCheck2()
  {
    // "document.getElementsByClassName(`${this._ajustes.ajustes.tema}-theme`)" = Se rastrean todos los elementos
    //                 que tengan la clase por ejemplo: "default-theme"
    // ".item(0)" = Se selecciona el primer elemento del arreglo generado
    // ".classList.add('working')" = se agrega la clase "working" al elemento selecionado
    document.getElementsByClassName(`${this._ajustes.ajustes.tema}-theme`)
     .item(0)
     .classList.add('working');
  }

}
