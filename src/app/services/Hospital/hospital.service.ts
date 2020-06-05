// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ COMPONENTES DEL SISTEMA ++++
import { Injectable } from '@angular/core';         // Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
                                                    // en los componentes y en diferentes sitios
import { HttpClient } from '@angular/common/http';  // Para poder realizar peticiones HTTP
import { map } from 'rxjs/operators';               // Para poder "tomar" las respuestas de las peticiones HTTP y transformarlas

// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { EntDesarrollo  } from '../../../environments/environment';

// ++++++++++ COMPONENTES DE TERCEROS ++++++++++
import swal from 'sweetalert2';

// ++++++++++ MODELOS CREADOS POR NOSOTROS ++++++++++
import { Hospital } from '../../Modelos/hospital';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../Usuario/usuario.service';  // No lo mandamos llamar desde "service.index" porque se genera un error extraño


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
export class HospitalService
{
  // PROPIEDADES
  token:    string;

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public http: HttpClient,
    public _servicioUsuario: UsuarioService
  )
  {
  }



  // <<<<<< Método para crear un Nuevo Hospital en BDD >>>>>>
  // "nombre" = Sólo s espera el nombre del Hospital
  crearHospital( nombre: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/hospital'"                    = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "'?token='"                      = Así se envía el token porque estamos haciendolo llegar por la URL
    let url: string = EntDesarrollo.URL_ServidorNode + '/hospital';
    url += '?token=' + this._servicioUsuario.token;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".post"      = Porque la petición usada es un POST
    // "url"        = URL completa de la Petición
    // "{ nombre }" = Es el nommbre del Hospital que se va a crear, lo mandamos como un objeto porque como string generaría error. Anteriormente se
                    // ponía: "{ nombre: nombre}" pero eso ahora es redundante
    // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"   = Hay que ponerlo asi para que "res.hospital" no marque error
    return this.http.post( url , { nombre } )
      .pipe( map( ( res: any ) =>
      {
        swal.fire('Hospital Creado', nombre , 'success');
        return res.hospital;
      }));
  }



  // <<<<<< Método para actualizar los datos de un Hospital en BDD >>>>>>
  actualizarHospital( hospital: Hospital )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/usuario'"                     = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "hospitañ._id"                   = Es el ID del Hospital a Modificar
    // "'?token='"                      = Así se envía el token porque estamos haciendolo llegar por la URL
    let url: string = EntDesarrollo.URL_ServidorNode + '/hospital/' + hospital._id;
    url += '?token=' + this._servicioUsuario.token;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".put "      = Porque la petición usada es un PUT
    // "url"        = URL completa de la Petición
    // "hospital"   = Objeto de tipo "Hospital" del que vamos a actualizar los datos
    // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
    return this.http.put( url , hospital )
      .pipe( map( ( res: any ) =>
      {
        swal.fire('Hospital Actualizado !!!', hospital.nombre, 'success');

        return true;
      }));

  }



  // <<<<<< Método para cargar el Listado de Hospitales >>>>>>
  // "desde: number = 0"  = A partir de cual página inicia el listado, el valor por default es "0" lo que indica que inicia en la página 1
  // "limite: number = 0" = Indica el número de elementos que deseamos obtener, el valor por default es "0" con lo cual trae todos los registros de la colección
  cargarHospitales( limite: number , desde: number = 0 )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/hospital?desde='"             = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "desde"                          = Es el número de página a partir del a cual se muestra el listado
    let url: string = EntDesarrollo.URL_ServidorNode + '/hospital?desde=' + desde + '&limite=' + limite;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get "      = Porque la petición usada es un GET
    // "url"        = URL completa de la Petición
    return this.http.get( url );
  }



  // <<<<<< Método para obtener los datos de un Hospital  >>>>>>
  // "id" = Es el ID del Hospital que se desea localizar
  obtenerHospital( id: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/usuario/"                     = Es la ruta del Servicio para Eliminar un Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "id"                             = Es el ID del Usuario que se va a eliminar
    let url: string = EntDesarrollo.URL_ServidorNode + '/hospital/' + id;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get"       =  Porque la petición usada es un GET
    // "url"        = URL completa de la Petición
    // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"   = Hay que ponerlo asi para que "res.hospital" no marque error, recordemos que en este caso se nos regresa el Objeto de  "Hospital" ya actualizado
    return this.http.get( url )
      .pipe( map( (res: any) => res.hospital ));

  }



  // <<<<<< Método para localizar a un Hospital(es) en base a una cadena de búsqueda >>>>>>
  buscarHospitales( cadenaBusq: string )
  {
    // "EntDesarrollo.URL_ServidorNode"   = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/busqueda/coleccion/hospitales/" = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "cadenaBusq"                       = Es la cadena de búsqueda para rastrear las coincidencias que encuentre de nombres de Usuarios
    let url: string = EntDesarrollo.URL_ServidorNode + '/busqueda/coleccion/hospitales/' + cadenaBusq;

    // return           = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get "          =  Porque la petición usada es un GET
    // "url"            = URL completa de la Petición
    // "res.hospitales" = Sólo regresamos el istado de Hospitales ya que tambien se regresa un campo booleano y ese no lo necesitamos
    return this.http.get( url )
    .pipe( map( ( res: any ) => res.hospitales ));
  }
}
