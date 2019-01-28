// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';

// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-promesas',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './promesas.component.html'   // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class PromesasComponent implements OnInit
{
  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor()
  {

    // Función que va a estar "escuchando" a la promesa
    this.contarTres().then(
      mensaje => console.log('Terminó!!', mensaje),
    )
    .catch( error => console.error('Error en la promesa', error));
  }


  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
  }


  // Método que nos devuelve una Promesa de tipo booleano
  contarTres(): Promise<number>
  {
    // Generamos una promesa
    return new Promise( ( respuesta, elerror ) =>
    {
      let contador = 0;

      // Creamos un intervalo de 1 segundo
      let intervalo = setInterval( () =>
      {
        contador += 1;
        console.log(contador);

        if ( contador === 3 )
        {
           respuesta(1);

           // elerror(2);

          clearInterval(intervalo);
        }
      }, 1000);
    });
  }

}
