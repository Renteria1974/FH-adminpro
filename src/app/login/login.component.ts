// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { Component, OnInit , NgZone } from '@angular/core';  // Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Router } from '@angular/router';           // Nos sirve para recoger parámetros por la URL, hacer redirecciones, etc...
import { NgForm } from '@angular/forms';


// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../services/service.index';

// ++++++++++ MODELOS CREADOS POR NOSOTROS ++++++++++
import { Usuario } from '../Modelos/usuario';


// Aquí mandamos llamar a la función "init_plugins" que declaramos en el archivo "custom.js" que está dentro de la carpeta "assets/js" y
// que nos sirve para corregir un error que se nos estaba presentando con el "sidebar"
declare function init_plugins();

declare const gapi: any;    // La usaremos para la autenticación a travez de Google


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-login',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './login.component.html',  // Plantilla asociada al componente
  styleUrls: ['./login.component.css']    // Archivo CSS asociado al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class LoginComponent implements OnInit
{
  // PROPIEDADES
  recuerdame: boolean;  // Para controlar el valor del campo "Recuerdame"
  email:      string;   // Para controlar el que se ponga el valor (en el campo "Cuenta de Correo") de la cuenta de email que actualmente está logueada
  auth2:      any;      // Para trabajar con la autenticación a travez de Google


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor
  (
    // Propiedades privadas del Servicio del Router
    public router: Router,
    public _servicioUsuario: UsuarioService,
    public _ngZone: NgZone
  )
  {
    this.recuerdame = false;
  }



  // <<<<<< Método ngOnInit >>>>>>
  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    init_plugins();     // Ejecutamos el código para corregir le error en el SIDEBAR

    this.googleInit();  // Inicializamos el Plugin de Google

    // "|| ''" = Si no tiene valor, si no existe ese "item" entonces ponemos unas comillas vacías
    this.email = localStorage.getItem( 'email' ) || '' ; // Obtenemos la cuenta de email que está logueada actualmente, si es que la hay y se pidió "Recordar"
    // Se "palomea" el campo RECUÉRDAME si hay en el LocalStorage un campo "email" con valor
    if ( this.email.length > 1 )
    {
      this.recuerdame = true;
    }
  }



  // <<<<<< Método que carga toda la inicialización del PlugIn de Google >>>>>>
  googleInit()
  {
    // ".load"  = Proceso de "Carga"
    // "'auth2" = Se carga el "auth2"
    // "()=>"   = Callback que es una función de flecha, se ejecuta una vez que terminíó el proceso ".load"
    gapi.load('auth2' , () =>
    {
      // ".init" = Recibe un objeto que es el "ID de Cliente" de Google (vaya, es el que copiamos y pegamos en el archivo "index.html")
      this.auth2 = gapi.auth2.init({
        client_id:    '1015315501689-0ps2tmu3rpp9auqdgdk3600imp029blb.apps.googleusercontent.com', // Es nuestro "ID de Cliente" de Google
        cookiepolicy: 'single_host_policy', // Es la política de cookies, creo que decimos que estamosaceptando cookies en nuestra aplicación
        scope:        'profile email'       // Es la información que necesitamos obtener de la cuenta de Google del Usuario que se está logueando
      });

      // Al presionar el botón de Autenticación por google se "dispare" el callback de Google
      // "document.getElementById"  = Localizamos a un elemento del DOM a travez de su "ID"
      // "'btnGoogle'"              = Es el botón que tiene la clase "btnGoogle" en donde se autentica el logueo a travez de Google
      this.attachSignIn( document.getElementById( 'btnGoogle' ) );

    });
  }



  // <<<<<< Método que"dispara2" el callback de Google >>>>>>
  // "elemento" = Es un elemento HTML
  attachSignIn( elemento )
  {
    // "elemento"     = Elemento HTML
    // "{}"           = Objeto vacío
    // "(googleUser)" = Objeto callback que al procesarse vamos a recibir el "Google User"
    this.auth2.attachClickHandler( elemento , {} , ( usuarioGoogle ) =>
    {
      // let profile = usuarioGoogle.getBasicProfile();  // Obtenemos el "profile" del Usuario que se está logueando
      let token = usuarioGoogle.getAuthResponse().id_token; // Obtenemos el "token" del Usuario que se está logueando

      // Hacemos el LOGUEO del usuario a travez de la cuenta de email de Google
      // "_servicioUsuario" = Nuestro servicio de Usuario, colocado en "services/Usuario/suario.service.ts"
      // ".loginGoogle"     = Método para Loguear al Usuario a travez de una cuenta de email de Google
      // ".subscribe"       = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "crearUsuario" se
                            // pueda "disparar"
      // "res"              = Respuesta
      // ""
      // "this.router.navigate( [ '/dashboard' ] )" = Una vez que el Usuario se loguea redireccionamos a la página principal de la Aplicación
      // "this._ngZone.run(" = Referente al pequeño inconveniente que se presenta al ingresar con la cuenta de google de que sale mal montado
                            // y cortado el dasboard, encontre que el detalle se debe a que la navegación es activada fuera de la zona de angular,
                            // por lo que se sugiere inyectar el servicio NgZone.
      this._servicioUsuario.loginGoogle( token )
        // .subscribe( res => this.router.navigate( [ '/dashboard' ] )  );
        .subscribe(() =>
        {
          this._ngZone.run(() => this.router.navigate(['/dashboard']));

          this.auth2.disconnect();  // Se borrará cualquier rastro de logeo y cada vez que querramos iniciar creará una nueva instancia del popup para
                                    // selección de la cuenta, de lo contrario queda guardada y por velocidad nos inicia con la última cuenta que seleccionamos
        });
    });
  }



  // <<<<<< Método en el que sólo hacemos uso del "routerLink" para navegar de esta pantalla a otra >>>>>>
  Ingresar( forma: NgForm )
  {
    // En caso de que el Formulario tengadatos inválidos
    if ( forma.invalid )
    {
      return;
    }

    // "let usuario"          = Creamos un objeto de tipo Usuario
    // "forma.value.email"    = Toma el valor del atributo "name" (name="email") que tenemos en el archivo HTML
    // "forma.value.password" = Toma el valor del atributo "name" (name="password") que tenemos en el archivo HTML
    let usuario = new Usuario( null , forma.value.email , forma.value.password );


    // "_servicioUsuario" = Nuestro servicio de Usuario, colocado en "services/Usuario/suario.service.ts"
    // ".Login"           = Método para Loguear al Usuario
    // ".subscribe"       = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "crearUsuario" se
                          // pueda "disparar"
    // "res"              = Es la respuesta que se recibe de la ejecución del método "Login", realmente no tenemos nada que hacer con ella
    // "this.router.navigate( [ '/dashboard' ] )" = Una vez que el Usuario se loguea redireccionamos a la página principal de la Aplicación
    this._servicioUsuario.Login( usuario , forma.value.recuerdame )
      .subscribe( res => this.router.navigate( [ '/dashboard' ] )  );
  }

}
