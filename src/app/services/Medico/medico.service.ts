// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ COMPONENTES DEL SISTEMA ++++
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Para poder realizar peticiones HTTP
import { map } from 'rxjs/operators';               // Para poder "tomar" las respuestas de las peticiones HTTP y transformarlas

// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { EntDesarrollo  } from '../../../environments/environment';

// ++++ MODELOS CREADOS POR NOSOTROS ++++
import { Medico } from '../../Modelos/medico';

// ++++ SERVICIOS CREADOS POR NOSOTROS ++++
import { UsuarioService } from '../Usuario/usuario.service';

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
export class MedicoService
{
  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public http: HttpClient,
    public _servicioUsuario: UsuarioService
  )
  { }



  // <<<<<< Método que sirve tanto para crear un Nuevo Medico en BDD así como para actualizar sus datos >>>>>>
  guadarMedico( medico: Medico )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/medico'"                      = Es la ruta del Servicio para Crear/Modificar los datos de un Médico en BDD, Tal como lo tenemos declarado en el POSTMAN
    // "'?token='"  = Así se envía el token porque estamos haciendolo llegar por la URL
    let url: string = EntDesarrollo.URL_ServidorNode + '/medico';

    // Si existe el ID del Médico significa que es una ACTUALIZACIÓN
    if ( medico._id )
    {
      url += '/' + medico._id;
      url += '?token=' + this._servicioUsuario.token;

      // --- ACTUALIZAR MÉDICO ----
      // return       = Deseamos ser notificados cuando se ejecute nuestro método PUT. Regresamos un "Observador" al cual nos vamos a poder subscribir
      // ".put"       = Porque la petición usada es un PUT
      // "url"        = URL completa de la Petición
      // "medico"     = Es el objeto de tipo Medico que se va a Actualizar
      // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
      // "res: any"   = Hay que ponerlo asi para que "res.medico" no marque error
      return this.http.put( url , medico )
        .pipe( map( ( res: any ) =>
        {
          swal.fire('Médico Actualizado', medico.nombre , 'success');
          return res.medico;
        }));
    }
    // Estamos CREANDO el registro de un Nuevo Médico
    else
    {
      url += '?token=' + this._servicioUsuario.token;

      // --- CREAR MÉDICO ----
      // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
      // ".post"      = Porque la petición usada es un POST
      // "url"        = URL completa de la Petición
      // "medico"     = Es el objeto de tipo Medico que se va a Crear
      // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
      // "res: any"   = Hay que ponerlo asi para que "res.medico" no marque error
      return this.http.post( url , medico )
        .pipe( map( ( res: any ) =>
        {
          swal.fire('Médico Creado', medico.nombre , 'success');
          return res.medico;
        }));
    }
  }



  // <<<<<< Método para cargar el Listado de HMédicos >>>>>>
  // "desde=0" = A partir de cual página inicial el listado, se pone en cero por si no se recibe con valor entonces inicia en la página 1
  cargarMedicos( desde: number = 0  )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/medico?desde='"               = Es la ruta del Servicio para mostrar el listado de Médicos, Tal como lo tenemos declarado en el POSTMAN
    // "desde"                          = Es el número de página a partir del a cual se muestra el listado
    let url: string = EntDesarrollo.URL_ServidorNode + '/medico?desde=' + desde;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get "      = Porque la petición usada es un GET
    // "url"        = URL completa de la Petición
    return this.http.get( url );
  }



  // <<<<<< Método para localizar a un Médico en base a una cadena de búsqueda >>>>>>
  buscarMedicos( cadenaBusq: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/busqueda/coleccion/medicos/"  = Es la ruta del Servicio rastrear a uno o varios Médicos, Tal como lo tenemos declarado en el POSTMAN
    // "cadenaBusq"                     = Es la cadena de búsqueda para rastrear las coincidencias que encuentre de nombres de Médicos
    let url: string = EntDesarrollo.URL_ServidorNode + '/busqueda/coleccion/medicos/' + cadenaBusq;

    // return         = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get "        =  Porque la petición usada es un GET
    // "url"          = URL completa de la Petición
    // "res.medicos" = Sólo regresamos el listado de Médicos ya que tambien se regresa un campo booleano y ese no lo necesitamos
    return this.http.get( url )
    .pipe( map( ( res: any ) => res.medicos ));
  }



  // <<<<<< Método para obtener los datos de un Médico  >>>>>>
  // "id" = Es el ID del Médico que se desea localizar
  obtenerMedico( id: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/medico/"                      = Es la ruta del Servicio para localizar a un Médico en la  BDD, Tal como lo tenemos declarado en el POSTMAN
    // "id"                             = Es el ID del Médico que se va a localizar
    let url: string = EntDesarrollo.URL_ServidorNode + '/medico/' + id;

    // return       = Deseamos ser notificados cuando se ejecute nuestro método POST. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".get"       =  Porque la petición usada es un GET
    // "url"        = URL completa de la Petición
    // ".pipe(.map" = Nos permite tomar la respuesta (res) y transformarla
    // "res: any"   = Hay que ponerlo asi para que "res.medico" no marque error, recordemos que en este caso se nos regresa el Objeto de "Medico"
    return this.http.get( url )
      .pipe( map( (res: any) => res.medico ));

  }
}
