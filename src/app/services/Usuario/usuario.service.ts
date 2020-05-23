// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ COMPONENTES DEL SISTEMA ++++
import { Injectable } from '@angular/core';         // Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
                                                    // en los componentes y en diferentes sitios
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';  // Para poder realizar peticiones HTTP
import { map } from 'rxjs/operators';               // Para poder "tomar" las respuestas de las peticiones HTTP y transformarlas

// ++++ MODELOS CREADOS POR NOSOTROS ++++
import { Usuario } from '../../Modelos/usuario';

// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { EntDesarrollo  } from '../../../environments/environment';

// ++++++++++ COMPONENTES DE TERCEROS ++++++++++
import swal from 'sweetalert2';


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
export class UsuarioService
{
  // PROPIEDADES
  usuario:  Usuario;
  token:    string;


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public http: HttpClient,
    public router: Router

  )
  {
    this.cargarStorage(); // Cargamos los valores del LocalStorage (si es que existen) en nuestras propiedades Locales
  }


  // <<<<<< Método para asegurarnos que el Usuario está Logueado >>>>>>
  estaLogueado()
  {
    // "? true : false" = Significa: Si se cumple la condicion retornamos true de lo contrario retornamos false
    return ( this.token.length > 5 ) ? true : false;  // Si existe el token entonces el Usuario está logueado

  }



  // <<<<<< Método para obtener los valores del LocalStorage y cargarlos a nuestras Propiedades Locales >>>>>>
  cargarStorage()
  {
    // Checamos que existe el "token" en el LocalStorage
    if ( localStorage.getItem( 'token' ) )
    {
      this.token    = localStorage.getItem( 'token' );                  // Obtenemos el valor del Token para asignarlo a nuestra Propiedad Local
      // "JSON.parse(" = Convertimos el string que tiene el LocalStorage a un objeto JSON
      this.usuario  = JSON.parse( localStorage.getItem( 'usuario' ) );  // Obtenemos el valor del objeto Usuario para asignarlo a nuestra Propiedad Local
    }
    // No hay elementos en el LocalStorage
    else
    {
      this.token    = '';
      this.usuario  = null;
    }
  }



  // <<<<<< Método para hacerle LOGUOT al Usuario logueado actualmente >>>>>>
  logOut()
  {
    this.usuario  = null;
    this.token    = '';

    // Sólo removemos ITEM's específicos, no usamos el método ".clear" ya que por ejmplo en esta aplicación el Template manda al LocalStorage un item
    // llamado "ajustes" y col el método "clear" también sería borrado
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate( [ '/login' ] ); // Redireccionamos a la página de LOGIN
  }



  // <<<<<< Método para guardar la sesión del Usuario en el LocalStorage >>>>>>
  guardarStorage( id: string , token: string , usuario: Usuario )
  {
    // ** ESTABLECEMOS LA PERSISTENCIA DE DATOS, GUARDAMOS EN LA MEMORIA DEL NAVEGADOR, EN UNA ESPECIE DE SESION EL "USUARIO" **
    // "localStorage.setItem"         = Guardamos un nuevo elemento en el LocalStorage, un nuevo índice, una nueva variable
    // "id,token,usuario"             = índice, elemento
    // "JSON.stringify(this.usuario)" = Convertimos el objeto a un JSON válido en formato String, El LocalStorage sólo permite guardar números o strings
    localStorage.setItem('id' , id );
    localStorage.setItem('token' , token );
    localStorage.setItem('usuario' , JSON.stringify( usuario ) );

    this.usuario = usuario;
    this.token = token;
  }



  // <<<<<< Método para loguear a un usuario usando una cuenta de email de GOOGLE >>>>>>
  // "token" = Se recibe un "token" que es el que se genera cuando se autentica la cuenta de email de Google con la que se desea loguearse
  loginGoogle( token: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/login'"                       = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    let url: string = EntDesarrollo.URL_ServidorNode + '/login/google';

    // return         = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".post"        = Porque la petición usada es un POST
    // "url"          = URL completa de la Petición
    // "{ token }"    = Lo recibimos como un "string plano", así que lo mandamos como un objeto, es decir, mandamos un objeto que tiene
                      // un token y a la vez el valor del token, anteriormente se declaraba como: "{ token: token }"
    // ".pipe( map("  = De esta forma evitamos modificar el código del método "ingresar" que está en el archivo "login.component.ts"
    // "res: any"     = Hay que ponerlo asi para que "res.id" no marque error
    return this.http.post( url , { token }  )
      .pipe( map( ( res: any ) =>
      {
        // Recordemos que la respuesta que recibimos al LOGUEAR a un Usuario es: id, ok, token, usuario (objeto JSON que contiene: id, email, goorle, nombre, password, rol)
        this.guardarStorage( res.id , res.token , res.usuario  );   // Guardamos la Sesión del Usuario en el LocalStorage

        return true;  // Esto es opcional es como indicar que todo salió bien
      }));
  }



  // <<<<<< Método para loguear a un Usuario de forma NORMAL >>>>>>
  Login( usuario: Usuario , recordar: boolean = false )
  {

    // "Palomeamos" el campo RECUERDAME entonces lo guardamos en el LocalStorage y ni siquiera nos interesa si el email es válido o no
    if ( recordar )
    {
      // ** ESTABLECEMOS LA PERSISTENCIA DE DATOS, GUARDAMOS EN LA MEMORIA DEL NAVEGADOR, EN UNA ESPECIE DE SESION EL "USUARIO" **
      // "localStorage.setItem" = Guardamos un nuevo elemento en el LocalStorage, un nuevo índice, una nueva variable
      // "email"                = índice, elemento
      localStorage.setItem('email' , usuario.email );
    }
    // No deseamos "recordar el email"
    else
    {
      localStorage.removeItem('email');
    }

    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/login'"                       = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    let url: string = EntDesarrollo.URL_ServidorNode + '/login';

    // return         = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".post"        = Porque la petición usada es un POST
    // "url"          = URL completa de la Petición
    // "usuario"      = Objeto de tipo "Usuario"
    // ".pipe( map("  = De esta forma evitamos modificar el código del método "ingresar" que está en el archivo "login.component.ts"
    // "res: any"     = Hay que ponerlo asi para que "res.id" no marque error
    return this.http.post( url , usuario )
      .pipe( map( ( res: any ) =>
      {
        // Recordemos que la respuesta que recibimos al LOGUEAR a un Usuario es: id, ok, token, usuario (objeto JSON que contiene: id, email, goorle, nombre, password, rol)
        this.guardarStorage( res.id , res.token , res.usuario  );   // Guardamos la Sesión del Usuario en el LocalStorage

        return true;  // Esto es opcional es como indicar que todo salió bien
      }));
  }



  // <<<<<< Método para crear un Nuevo Usuario en BDD >>>>>>
  crearUsuario(usuario: Usuario)
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/usuario'"                     = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    let url: string = EntDesarrollo.URL_ServidorNode + '/usuario';

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".post"      = Porque la petición usada es un POST
    // "url"        = URL completa de la Petición
    // "usuario"    = Objeto de tipo "Usuario"
    // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"   = Hay que ponerlo asi para que "res.usuario" no marque error
    return this.http.post( url , usuario )
      .pipe( map( ( res: any ) =>
      {
        swal.fire('Correo Creado', usuario.email, 'success');
        return res.usuario;
      }));
  }
}
