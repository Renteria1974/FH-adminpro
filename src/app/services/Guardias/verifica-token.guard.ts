// Esto es un "GUARD", El objetivo de este servicio es utilizar este elemento en la configuración de rutas
// Es para proteger que incluso desde la barra de direcciones no se pueda entrar a una ventana a la que el usuario no tiene permiso

// ++++++++++ SERVICIOS DEL SISTEMA ++++++++++
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../Usuario/usuario.service';  // Recordemos aquí no podemos llamarlo desde SERVICE.INDEX.TS


// Decorador Inyectable. Definición del Componente. Con las "{}" se le pasa un Objeto JSON, no se cierra con ";" porque no es una función
// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas características concretas que modifican su comportamiento
@Injectable({
  providedIn: 'root'
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2 se pueden "imprimir" sin ningun problema, se la salta,
//       aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class VerificaTokenGuard implements CanActivate
{
  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente lo primero en ejecutarse es el Constructor.
  //              Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService,
    public router: Router
  )
  {

  }



  // Implementamos el Método "CanActivate", sólo puede regresar un valor booleano
  // Es el que le va a decir a la ruta que tenga implementada este "guard" que esta es la condición que debe cumplir si lo quieres dejar "pasar"
  // "Promise<boolean> | boolean" = Este GUARD puede regresar 2 cosas: un valor BOOLEANO o una Promesa que retorna un BOOLEANO
  canActivate(): Promise<boolean> | boolean
  {
    console.log('Token Guard');

    let token = this._servicioUsuario.token;  // A nuestra propiedad le asignamos el valor del Token

    // El Token tien información
    if (token)
    {
      // payload                = Es el contenido del Token
      // JSON.parse"            = Para poder evaluar un String y en este caso el Token es un String
      // "atob"                 = Función que decodifica una cadena de datos que ha sido codificada utilizando la codificación en base-64 (la que usamos para generar el Token)
      // "token.split('.')[1]"  = La cadena completa la separamos en un arreglo cuyos elementos se definen por el caracter "."
      let payload = JSON.parse( atob( token.split('.')[1] ) );

      // "payload.exp"  = Es la Representación de la Fecha y Hora EPOCH en que expirará el Token
      // "EPOCH"        = Corresponde con el número de segundos (valor positivo) transcurridos desde la medianoche  UTC del 1 de enero de 1970 (00:00).
                        // Se tutiliza como un punto de referencia a partir del cual se mide el tiempo con el fin de oditir ambiguedades, debido a la
                        // gran variedad de unidades de tiempo empleadas en sistemas informáticos
      let expirado = this.expirado( payload.exp );

      // El Token ya expiró
      if ( expirado )
      {
        this.router.navigate(['/login']);         // Ya que el Token ha expirado entonces mandamos al Usuario a la ventana de LOGIN
        return false;                             // Con esto el GUARD no va a dar el permiso al Usuario para que entré (en este caso) a la ventana DASHBOARD
      }

      return this.verificaRenueva( payload.exp ); // Si el Token ya está por Expirar Generamos uno nuevo
    }
    // El token está vacío
    else
    {
      this.router.navigate(['/login']);   // Ya que no hay un Tpken válido mandamos al Uusario a la ventana de LOGIN
      return false;                       // Con esto el GUARD no va a dar el permiso al Usuario para que entré (en este caso) a la ventana DASHBOARD
    }
  }



  // <<<<<< Método que verifica si hay que renovar el Token >>>>>>
  // "Promise<boolean>" = Indicamos que es una función que regresa una promesa y esa Promesa retorna un booleano
  verificaRenueva( fechaExp: number ): Promise<boolean>
  {
    // Se retorna una Promesa
    return new Promise( ( resuelto , rechazado ) =>
    {
      // ---- Fecha de Expiración del Token Actual ----
      // Primero traemos el token a un tiempo actual, a una fecha presente
      // "fechaExp * 1000" = Se multiplica por 1000 porque viene en Segundos y hay que transformarla a Milisegundos
      let tokenExp = new Date( fechaExp * 1000 );

      // ---- Fecha Actual ----
      let ahora = new Date(); // Es la fecha actual (del navegador, de la PC de donde está corriendo la Aplicación)

      // ---- Generamos una hora ficticia ("adelantamos" el reloj) para simular que al token le queda menos tiempo para Expirar  ----
      // Recordemos que le hemos dado a Nuestros Token 4 horas para que expiren
      // "ahora.getTime()"    = Obtenemos el momento actual
      // "4 * 60 * 60 * 1000" = 4 horas * 60 minutos * 60 segundos * 1000 milisegundos (es decir, lo transformamos a milisegundos)
      // "1"                  = Se adelanta el reloj 1 hora, es decir, quiero renovar el token cuando el actual expire en 1 hora o menos
      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

      // Si La fecha de expiración del Token es mayor a la Fecha ficticia que generamos entonces NO RENOVAMOS EL TOKEN
      if ( tokenExp.getTime() > ahora.getTime() )
      {
        resuelto( true ); // No deseamos renovar el Token
      }
      // El Token está próximo a vencer (le falta 1 hora o menos), hay que Renovarlo
      else
      {
        // Renovamos el Token
        this._servicioUsuario.renuevaToken()
          // "()" = Nos regresa un valor booleano, pero en este caso no nos interesa procesarlo, por eso sólo ponemos los paréntesis
          .subscribe( () =>
          {
            resuelto( true ); // Si se renueva el Token, podemos continuar con la operación que deseamos realizar
          },
          // En caso de haber ocurrido un problema usamos la segunda función del "subscribe" que es el "rechazado". Es decir, se prohibe la operación que se
          // deseaba realizar
          () =>
          {
            // this.router.navigate(['/login']); // Ya que el Token ha expirado entonces mandamos al Usuario a la ventana de LOGIN
            rechazado( false );
          });
      }
    });

  }



  // <<<<<< Método que nos indica si el Token ya expiró >>>>>>
  // "fechaExp" = Fecha de Expiración del Token actual, está en Segundos
  expirado( fechaExp: number )
  {
    // "getTime" = Nos dá el tiempo en Milisegundos, por eso se divide entre 1000 para que nos arroje Segundos
    let ahora = new Date().getTime() / 1000;

    // La fecha del token es menor quel a fecha actual
    if ( fechaExp < ahora )
    {
      return true;  // El Token ya no nos Sirve, ya expiró
    }
    else
    {
      return false; // El Token aun NO expira, aún es válido
    }
  }

}
