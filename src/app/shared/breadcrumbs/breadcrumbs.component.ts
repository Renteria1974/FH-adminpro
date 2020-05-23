// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-breadcrumbs',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './breadcrumbs.component.html'   // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class BreadcrumbsComponent implements OnInit
{

  public titulo: string;  // Propiedad para el título del encabezado de la pagina

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  // "private router: Router" = Inyectamos esta variablepara poder obtener los parámetros que definimos en el "pages.routes.ts",
  //                             es decir, la "data" de cada ruta
  // "private title: Title"   = Inyectamos esta varible para poder colocar un título personalizado (en la pestaña del navegador web)
  //                             que indique en cuál página de nuestra aplicación nos encontramos
  // "private meta: Meta"     = Inyectamos esta variable para poder
  constructor( private router: Router, private title: Title, private meta: Meta )
  {
    this.getDataRoute()
    .subscribe( data => {
      // Recordemos que "data" es la propiedad tipo objeto quedeclaramos en las rutas en el archivo "pages.routes.ts"
      // console.log( data );

      // Dar valor a la propiedad de título contenida en la propiedad "data"
      this.titulo = data.titulo;

      // Al título de la pestaña de nuestro explorador también le asignamos el valor de la propiedad "data"
      this.title.setTitle( this.titulo );

      // Creamos, construimos un "metatag"
      // "MetaDefinition" = No es obligatorio especificar esto, pero va a ayudar para que al momento de estar escribiendo las instrucciones
      //                   nos despliegue información, ayuda correcta y evitar errores de escritura
      const metaTag: MetaDefinition =
      {
        name: 'description',
        content: this.titulo
      };

      // Hacemos la actualización en el HTML, con esto creamos en forma dinámica una etiqueta "meta" dentro
      // del archivo "index.html" cuya propiedad "description" tendrá el valor de la página que esté cargada en ese momento
      this.meta.updateTag( metaTag );


    });
  }


  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
  }


  // Método que retorna un nuevo "Observable"
  getDataRoute()
  {
    // "this.router.events" = Es un observable
    // "pipe"   = (tubería) permite transformar la información de alguna manera, o hacer algún proceso de
    return this.router.events.pipe(
    // "filter" = Recibe como argumento una función
    // Forzosamente debe regresar "true" o "false", si es "true" se muestra el resultado, si es "false" no se muestra
    // Recibe 2 argumentos: "valor" (o la respuesta) y una posición "index" ( el núm. de veces que se ha llamado a este filter)

    // Este filtro recibe como parámetro un evento y retorna sólo los eventos del tipo "ActivationEnd"
    filter( evento => evento instanceof ActivationEnd ),
    // Este filtro recibe eventos del tipo "ActivationEnd" y retorna solo aquel cuya propiedad "firstChild" sea "null"
    filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
    // Con el operador "map" obtenemos el valor del "data" del "snapshot"
    // "evento: ActivationEnd" = Recibimos como parámetro un evento del tipo "ActivationEnd"
    // "evento.snapshot.data"  = Retornamos el valor del "data" que está dentro del "snapshot"
    map( ( evento: ActivationEnd ) => evento.snapshot.data )
    );
  }

}
