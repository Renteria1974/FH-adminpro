// Esto es un "GUARD", El objetivo de este servicio es utilizar este elemento en la configuración de rutas
// Es para proteger que incluso desde la barra de direcciones no se pueda entrar a una ventana a la que el usuario no tiene permiso

// ++++++++++ SERVICIOS DEL SISTEMA ++++++++++
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

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
export class AdminGuard implements CanActivate
{

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente lo primero en ejecutarse es el Constructor.
  //              Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService,
    // public router: Router                     // Para poder redireccionar a otra página de la aplicación
  )
  {}

  // Implementamos el Método "CanActivate", sólo puede regresar un valor booleano
  // Es el que le va a decir a la ruta que tenga implementada este "guard" que esta es la condición que debe cumplir si lo quieres dejar "pasar"
  canActivate()
  {
    // El Usuario logueado es del tipo ADMIN
    if ( this._servicioUsuario.usuario.role === 'ROLE_ADMIN' )
    {
      return true;
    }
    // El Usuario logueado es del tipo USER
    else
    {
      console.log( 'Bloqueado y Expulsado por el ADMIN GUARD' );
      this._servicioUsuario.logOut();                 // Sacamos al Usuario de la Aplicación .. es por intentar violar la seguridad
      // this.router.navigate( ['/login'] );             // Redireccionamos al Usuario a la página del LOGIN
      return false;
    }
  }

}
