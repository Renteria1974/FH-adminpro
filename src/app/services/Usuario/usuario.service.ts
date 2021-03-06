// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ COMPONENTES DEL SISTEMA ++++
import { Injectable } from '@angular/core';                       // Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante
                                                                  // la inyección de dependencias en los componentes y en diferentes sitios
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';                // Para poder realizar peticiones HTTP
import { map, catchError } from 'rxjs/operators';                 // Para poder "tomar" las respuestas de las peticiones HTTP y transformarlas

import { throwError } from 'rxjs/internal/observable/throwError'; //  para el manejo del CAYCH y THROW en el control de errores



// ++++ MODELOS CREADOS POR NOSOTROS ++++
import { Usuario } from '../../Modelos/usuario';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { SubirArchivoService } from '../SubirArchivo/subir-archivo.service';

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
  menu:     any = [];


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public http: HttpClient,
    public router: Router,
    public _servicioSubirArchivo: SubirArchivoService
  )
  {
    this.cargarStorage(); // Cargamos los valores del LocalStorage (si es que existen) en nuestras propiedades Locales
  }



  // <<<<<< Método para Renovar el Token del Usuario que está Logueado >>>>>>
  renuevaToken()
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/login/renuevaToken?token'"  = Es la ruta del Servicio para generar un nuevo Token al Usuario Logueado, Tal como lo tenemos declarado en el POSTMAN
    let url: string = EntDesarrollo.URL_ServidorNode + '/login/renuevaToken';
    url += '?token=' + this.token;

    // return         = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get"         = Porque la petición usada es un GET
    // "url"          = URL completa de la Petición
    // ".pipe(.map"   = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"     = Hay que ponerlo asi para que "res.id" no marque error
    return this.http.get( url )
      .pipe( map( ( res: any ) =>
      {
        this.token = res.token;                       // A nuestra propiedad Local le asignamos el valor del Nuevo Token que se acaba de generar

        localStorage.setItem('token' , this.token );  // Grabamos en el LocalStorage el nuevo Token

        console.log('Token ha sido Renovado');

        return true;                                  // Esto es opcional es para indicarle a lo que sea que se "subscriba" que reciba un "true" al hacerlo
      }),
      // Capturamos el error(err) el cuál es el que configuramos en el BACKEND, es el archivo "login.js" que está dentro el a carpeta "Rutas"
      catchError( err =>
      {
        this.router.navigate(['/login']);             // Redireccionamos al Usuario para uqe se vuelva a Loguear
        swal.fire('No se pudo renovar Token' , 'Error al renovar Token' , 'error');
        return throwError( err );
      }));
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
      this.menu     = JSON.parse( localStorage.getItem( 'menu' ) );     // Obtenemos el valor del objeto Usuario para asignarlo a nuestra Propiedad Local
    }
    // No hay elementos en el LocalStorage
    else
    {
      this.token    = '';
      this.usuario  = null;
      this.menu     = [];
    }
  }



  // <<<<<< Método para hacerle LOGUOT al Usuario logueado actualmente >>>>>>
  logOut()
  {
    this.usuario  = null;
    this.token    = '';
    this.menu     = [];

    // Sólo removemos ITEM's específicos, no usamos el método ".clear" ya que por ejmplo en esta aplicación el Template manda al LocalStorage un item
    // llamado "ajustes" y col el método "clear" también sería borrado
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate( [ '/login' ] ); // Redireccionamos a la página de LOGIN
  }



  // <<<<<< Método para guardar la sesión del Usuario en el LocalStorage >>>>>>
  guardarStorage( id: string , token: string , usuario: Usuario , menu: any )
  {
    // ** ESTABLECEMOS LA PERSISTENCIA DE DATOS, GUARDAMOS EN LA MEMORIA DEL NAVEGADOR, EN UNA ESPECIE DE SESION EL "USUARIO" **
    // "localStorage.setItem" = Guardamos un nuevo elemento en el LocalStorage, un nuevo índice, una nueva variable
    // "id,token,usuario"     = índice, elemento
    // "JSON.stringify()"     = Convertimos el objeto a un JSON válido en formato String, El LocalStorage sólo permite guardar números o strings
    localStorage.setItem('id' , id );
    localStorage.setItem('token' , token );
    localStorage.setItem('usuario' , JSON.stringify( usuario ) );
    localStorage.setItem('menu' , JSON.stringify( menu ) );

    this.usuario  = usuario;
    this.token    = token;
    this.menu     =  menu;
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
    // ".pipe(.map"   = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"     = Hay que ponerlo asi para que "res.id" no marque error
    return this.http.post( url , { token }  )
      .pipe( map( ( res: any ) =>
      {
        // Recordemos que la respuesta que recibimos al LOGUEAR a un Usuario es: id, ok, token, usuario (objeto JSON que contiene: id, email, goorle, nombre, password, rol)
        this.guardarStorage( res.id , res.token , res.usuario , res.menu  );   // Guardamos la Sesión del Usuario en el LocalStorage
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
    // ".pipe(.map"   = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"     = Hay que ponerlo asi para que "res.id" no marque error
    return this.http.post( url , usuario )
      .pipe( map( ( res: any ) =>
      {
        // Recordemos que la respuesta que recibimos al LOGUEAR a un Usuario es: id, ok, token, usuario (objeto JSON que contiene: id, email, goorle, nombre, password, rol)
        this.guardarStorage( res.id , res.token , res.usuario , res.menu  );   // Guardamos la Sesión del Usuario en el LocalStorage
        return true;  // Esto es opcional es como indicar que todo salió bien
      }),
      // Capturamos el error(err) el cuál es el que configuramos en el BACKEND, es el archivo "login.js" que está dentro el a carpeta "Rutas"
      catchError( err =>
      {
        return throwError( err );
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
        return res.usuario;
      }),
      // Capturamos el error(err) el cuál es el que configuramos en el BACKEND, es el archivo "login.js" que está dentro el a carpeta "Rutas"
      catchError( err =>
      {
        return throwError( err );
      }));
  }



  // <<<<<< Método para actualizarl os datos del Usuaro en BDD >>>>>>
  actualizarUsuario( usuario: Usuario )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/usuario'"                     = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "usuario._id"                    = Es el ID del Usuario a Modificar
    // "'?token='"                      = Así se envía el token porque estamos haciendo lo llegar por la URL
    let url: string = EntDesarrollo.URL_ServidorNode + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".put "      = Porque la petición usada es un PUT
    // "url"        = URL completa de la Petición
    // "usuario"    = Objeto de tipo "Usuario" del que vamos a actualizar los datos
    // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"   = Hay que ponerlo asi para que "res.usuario" no marque error, recordemos que en este caso se nos regresa el Objeto de  "Usuario" ya actualizado
    return this.http.put( url , usuario )
      .pipe( map( ( res: any ) =>
      {
        // El Usuario que se está modificando es el mismo que está Logueado, entonces actualizamos el LocalStorage
        if ( usuario._id === this.usuario._id )
        {
          let usuarioDB: Usuario = res.usuario;                                       // A nuestra variable local le asignamos el objeto nuevo que nos regresa el método "map"
          this.guardarStorage( usuarioDB._id , this.token , usuarioDB , this.menu );  // Actualizamos el LocalStorage con los nuevos datos del Usuario
        }

        swal.fire('Usuario Actualizado !!!' , usuario.nombre , 'success');

        return true;
      }),
      // Capturamos el error(err) el cuál es el que configuramos en el BACKEND, es el archivo "login.js" que está dentro el a carpeta "Rutas"
      catchError( err =>
      {
        // console.log(err);
        swal.fire('Error en el Login' , err.error.errores.message , 'error');
        return throwError( err );
      }));

  }



  // <<<<<< Método para cambiar la Imagen del Usuario >>>>>>
  // "archivo"  = Objeto de tipo Archivo
  // "id"       = Esel ID del Usuario
  cambiarImagen( archivo: File , id: string )
  {
    // ++ Subimos la Imagen, el Avatar del Usuario ++
    // "".subirArchivo"         = Método que definimos en el archivo "subir-archivo.service.ts"
    // "archivo"                = Es en sí el documento, el archivo
    // "'usuarios"              = Es el tipo de archivo a subir (tambien hay: 'hospitales', 'medicos')
    // "id"                     = Es el ID del objeto, en este caos del Usuario (Podría ser también de un Hospital o un Médico)
    this._servicioSubirArchivo.subirArchivo( archivo , 'usuarios' , id )
      // Recordemos que el método "subirArchivo" nos regresa una PROMESA, así definimos
      // Usamos el método "then" para capturar la respuesta que nos llegue
      // "(res: any)" = Función de callback que nos devuelve una respuesta(res)
      .then( ( res: any ) =>
      {
        // A nuestro usuario logueado le asignamos el nombre de la imagen de su avatar
        this.usuario.img = res.usuarios.img;

        swal.fire('Imagen Actualizada !!!' , this.usuario.nombre , 'success');  // Ponemos un mensaje en Pantalla

        // Actualizamos en el LOCALSTORAGE
        this.guardarStorage( id , this.token , this.usuario , this.menu );

      })
      // Si algo sale mal disparamos el ".catch"
      // "res" = respuesta
      .catch( res =>
      {
        console.log( res );
      });
  }



  // <<<<<< Método para cargar el Listado de Usuarios >>>>>>
  // "desde=0" = A partir de cual página inicial el listado, se pone en cero por si no se recibe con valor entonces inicia en la página 1
  cargarUsuarios( desde: number = 0  )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/usuario?desde='"              = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "desde"                          = Es el número de página a partir del a cual se muestra el listado
    let url: string = EntDesarrollo.URL_ServidorNode + '/usuario?desde=' + desde;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get "      = Porque la petición usada es un GET
    // "url"        = URL completa de la Petición
    return this.http.get( url );
  }



  // <<<<<< Método para localizar a un Usuario en base a una cadena de búsqueda >>>>>>
  buscarUsuarios( cadenaBusq: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/busqueda/coleccion/usuarios/" = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "cadenaBusq"                     = Es la cadena de búsqueda para rastrear las coincidencias que encuentre de nombres de Usuarios
    let url: string = EntDesarrollo.URL_ServidorNode + '/busqueda/coleccion/usuarios/' + cadenaBusq;

    // return         = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get "        =  Porque la petición usada es un GET
    // "url"          = URL completa de la Petición
    // "res.usuarios" = Sólo regresamos el istado de Usuarios ya que tambien se regresa un campo booleano y ese no lo necesitamos
    return this.http.get( url )
    .pipe( map( ( res: any ) => res.usuarios ));
  }



  // <<<<<< Método para eliminar de la BDD el registro de un Usuario  >>>>>>
  // "id" = Esel ID del Usuario que se desea eliminar
  borrarUsuario( id: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/usuario/"                     = Es la ruta del Servicio para Eliminar un Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "id"                             = Es el ID del Usuario que se va a eliminar
    // "'?token='"                      = Así se envía el token porque estamos haciendo lo llegar por la URL
    let url: string = EntDesarrollo.URL_ServidorNode + '/usuario/' + id;
    url += '?token=' + this.token;

    // return         = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".delete "     =  Porque la petición usada es un DELETE
    // "url"          = URL completa de la Petición
    return this.http.delete( url )
    .pipe( map( ( res: any ) =>
    {
      swal.fire('Usuario Borrado !!!' , 'El Usuario ha sido ELiminado Correctamente' , 'success');
      return true;
    }));
  }
}
