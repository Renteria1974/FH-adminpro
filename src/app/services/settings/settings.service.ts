// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales


// Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
// en los componentes y en diferentes sitios
import { Injectable } from '@angular/core';


// Decorador Inyectable. Definición del Componente. Con las "{}" se le pasa un Objeto JSON, no se cierra con ";" porque no es una función
// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas características concretas
// que modifican  su comportamiento, en pocas palabras, con esta declaración indicamos queesta clase la vamos a poder inyectar
// (de forma automática) como servicio en cualquier componente de la aplicación sin que se tenga que añadir en "app.module.ts"
@Injectable({
  providedIn: 'root'
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que
// las 2 se pueden "imprimir" sin ningun problema, se la salta, aunque por buena costumbre de
// programación hacer buen uso de ese tipo de declaraciones
export class SettingsService
{
  // Valores por defecto que permitan poder establecer un tema si no se ha seleccionado uno
  // y tambien saber que tema está seleccionado
  ajustes: Ajustes =
  {
    temaUrl: 'assets/css/colors/default.css',  // Tema por defecto que tendrá el Encabezado del menú Prncipal
    tema: 'default'                            // Nombre del tema
  };


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor( )
  {
    // Cargamos los valores de configuración (del Encabezado del Menú Principal) que tenemos en el LocalStorage
    // Se carga al arrancar la aplicación ya que este servcicio se "inyectó" en el "constructor" del "app.component.ts"
    // y esos dispara automáticamente este constructor del servicio
    this.cargarAjustes();
  }


  // Método que Graba los ajustes (que hicimos) en el LocalStorage
  guardarjustes()
  {
    // 'ajustes'       = Creamos un item en el localStorage llamado "ajustes"
    // JSON.stringify  = Convierte el objeto "ajustes" en un string, ya que es lo que acepta el LocalStorage
    localStorage.setItem('ajustes', JSON.stringify( this.ajustes ));
  }


  // Método que Carga los ajustes (que hicimos) que tenemos en el LocalStorage
  cargarAjustes()
  {
    // Validamos que tengamos el item "ajustes" en el LocalStorage
    if ( localStorage.getItem( 'ajustes' ) )
    {
      // Asignamos a nuestra variable el valor que almacenamos en el LocalStorage
      // Tenemos que convertirlo a formato JSON porque nuestra variable "ajustes" es del tipo JSON
      this.ajustes = JSON.parse(localStorage.getItem( 'ajustes' ));

      // Aquí cargamos la configuración del Encabezado del Menú Principal
      this.aplicarTema( this.ajustes.tema );
    }
    else
    {
      // Se cargan los valore por defecto, esto funciona porque al objeto "ajustes" le asignamos al inicio los valores "default"
      this.aplicarTema( this.ajustes.tema );
    }
  }


  // Método para cargar el tema (color de fondo) del Encabezado del Menú Principal
  aplicarTema( tema: string)
  {
     // Variable que contiene el path del archivo de color de fondo
    let url = `assets/css/colors/${ tema }.css`;

    // ++ MANDAR LOS VALORES DE CONFIGURACIÓN AL LOCALSTORAGE ++
    // ------------------------------------------------------------
    // Le asignamos el valor a la propiedad "tema" del objeto "ajustes" del servicio "_ajustes"
    this.ajustes.tema = tema;
    // Le asignamos el valor a la propiedad "temaurl" del objeto "ajustes" del servicio "_ajustes"
    this.ajustes.temaUrl = url;
    // Guardamos los valores en el LocalStorage
    this.guardarjustes();
    // ------------------------------------------------------------
  }
}


// Interfaz que va a ayudar a restringir la forma de trabajar los ajustes, definir que tipo de información va a permitirse en los ajustes
interface Ajustes
{
  temaUrl: string;
  tema: string;
}
