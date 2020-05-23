// Esto es un "GUARD", El objetivo de este servicio es utilizar este elemento en la configuración de rutas
// Es para proteger que incluso desde la barra de direcciones no se pueda entrar a una ventana a la que el usuario no tiene permiso

// ++++++++++ SERVICIOS DEL SISTEMA ++++++++++
import { Injectable } from '@angular/core';     // Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
import { CanActivate, Router } from '@angular/router';  // Nos sirve para recoger parámetros por la URL, hacer redirecciones, etc...
                                                // El "CanActivate" es la Propiedad de una configuración de una ruta que nos va a permitir hacer la funcionalidad
                                                // del "GUARD", es una implementación, una interfaz, comprobar si podems acceder a una ruta URL o no

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../Usuario/usuario.service';  // En este archivo por causa desconocida NO acepta indiquemos "/service.index"


// Decorador Inyectable. Definición del Componente. Con las "{}" se le pasa un Objeto JSON, no se cierra con ";" porque no es una función
// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas características concretas que modifican su comportamiento
@Injectable({
  providedIn: 'root'
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2 se pueden "imprimir" sin ningun problema, se la salta,
//       aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class LoginGuardGuard  implements CanActivate
{
  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente lo primero en ejecutarse es el Constructor.
  //              Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService,
    public router: Router
  )
  {}


  // Implementamos el Método "CanActivate", sólo puede regresar un valor booleano
  // Es el que le va a decir a la ruta que tenga implementada este "guard" que esta es la condición que debe cumplir si lo quieres dejar "pasar"
  canActivate()
  {
    // Checamos si el Usuario está logueado
    if ( this._servicioUsuario.estaLogueado() )
    {
      console.log('Pasó el GUARD');
      return true;
    }
    // El Usuario NO está logueado
    else
    {
      console.log('Bloqueado por el GUARD');
      this.router.navigate( [ '/login' ] );   // Nos redireccione a la página del LOGIN

      return false;
    }
  }

}
