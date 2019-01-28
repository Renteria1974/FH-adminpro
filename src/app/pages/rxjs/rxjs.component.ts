// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit, OnDestroy } from '@angular/core';
// Para poder usar los "observables"
import { Observable, Subscriber, Subscription } from 'rxjs';
// Para poder manejar el "retry" en los "observables"
import { retry, map, filter } from 'rxjs/operators';

// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-rxjs',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './rxjs.component.html'   // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class RxjsComponent implements OnInit, OnDestroy
{
  // Creamos una propiedad que se peda usar para mantener una referencia a el observador que está ejecutándose
  subscripcion: Subscription;


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor()
  {
    // "this.subscripcion" = Con esto mantenemos una referencia al observable
    // "pipe"   = (tubería) permite transformar la información de alguna manera, o hacer algún proceso de
    //            transformación de "data" de alguna manera
    // ()       = Se reintenta una y otra vez (indefinidamente) la operación del "observador" al ocurrir un error
    // (X)      = Si por ejemplo se le pone "2" entonces despues de que ocurre el error se hacen 2 intentos más
    this.subscripcion = this.regresaObservable()

    // Aquí es donde se "subscribe" al observable para que comienze a "escuchar"
    .subscribe(
      // Este es el primer callback, es cuando se llama un "next", cuando se recibe algo del string de datos
      numero => console.log( 'Subs: ', numero ),
      // Este es el segundo callback es un error, se detiene el "observador" a menos que usemos un "retry"
      error => console.error('Error en el obs: ', error),
      // El tercer callback no recibe ningún parámetro, es cuando el "observador" ya deja de "escuchar", termina su ejecución
      () => console.log('El Observador terminó')
    );

  }




  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
  }


  // Se llama solo una vez, justo antes de que Angular destruya el componente, y sirve para prevenir
  // "memory leaks", eliminando por ejemplo suscripciones a "Observables y "event handlers"
  ngOnDestroy()
  {
    console.log('La página se está cerrando.....');

    // Cerramos el "observador", dejará de "escuchar"
    this.subscripcion.unsubscribe();
  }


  // Método que nos regresa un "Observable"
  // "Observable<number>" = Indicamos que este método regresa un "Observable" de tipo numérico,
  //                       en este caso estamos regresanso la variabñe "contador"
  regresaObservable(): Observable<any>
  {
    // "return" = indicamos directamente que vamos a retornar un "Observable"
    return new Observable( (observer: Subscriber<any>) =>
    {
      let contador = 0;
      let intervalo = setInterval( () =>
      {
        contador ++;

        const salida =
        {
          valor: contador
        };

        observer.next( salida );  // Con esto estamos notificando al código al cual estamos "subscritos"

        // Detenemos el "setinterval" pero el "observable sigue "escuchando"
        // if ( contador === 3 )
        // {
          // clearInterval( intervalo ); // Limpiamos los valores del intervalo
          // observer.complete();        // Aquí detenemos la ejecución del observable, ya no "escuchará" más
        // }

        // Provocamos un error intencionalmente antes de que llegu a "3"
        // if ( contador === 2 )
        // {
          // Esto lo pusimos "comentado" porque estamos dando por hecho que despues de los intentos que especificamos en el retry (2)
          // ya se solucionó el problema, aunque es algo arriesgado esa suposición
          // clearInterval( intervalo );  // Limpiamos los valores del intervalo

          // observer.error('Auxilio !!!!!!');  // Generamos el error para detener elobservable o bien que el "retry" reintente la operación
        // }
      }, 1000);
    }).pipe(
      // Este operador recibe una función que permite transformar la "data"
      // "resp" = Recibe un parámetro, es la respuesta en bruto, contiene el valor que nos interesa
      map( resp => resp.valor ),

      // Recibe como argumento una función
      // Forzosamente debe regresar "true" o "false", si es "true" se muestra el resultado, si es "false" no se muestra
      // Recibe 2 argumentos: "valor" (o la respuesta) y una posición "index" ( el núm. de veces que se ha llamado a este filter)
      filter( (  valor, index) => {
        // console.log( 'Filter: ', valor, index );
        // Numero impar
        if ( ( valor % 2 ) === 1 )
        {
          return true;
        }
        // Número par
        else
        {
          return false;
        }

      })
     );
  }


}
