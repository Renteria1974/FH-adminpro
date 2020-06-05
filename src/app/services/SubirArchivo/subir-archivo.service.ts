// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ COMPONENTES DEL SISTEMA ++++
import { Injectable } from '@angular/core'; // Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
                                            // en los componentes y en diferentes sitios

// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { EntDesarrollo  } from '../../../environments/environment';


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
export class SubirArchivoService
{
  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(

  )
  { }


  // <<<<<< >>>>>>
  // Aquí usamos JavaScript puro ya que Bottstrap aún no tiene esta funcionalidad
  // Con este mpetodo podemos subir cualquier tipo de archivo
  // "archivo: File"  = Recibimos un argumento de tipo "File" que es un tipo de TypeScript como calquier otro: string, number, etc
  // "tipo: string"   = Saber que tip ode imagen vamos a recibir: Usuario, Médico, Hospital
  // "id: string"     = Es el ID del médico o del Hospital o del Usuario
  subirArchivo( archivo: File , tipo: string , id: string )
  {
    // Es lo que tenemos que subir o mandar a lapetición por AJAX, simulamos que tenemos un formulario real, es el PAYLOAD que queremo mandar a subir
    let formData = new FormData();

    let xhr = new XMLHttpRequest();     // xhr es un acrónimo de AJAX, esto es una petición AJAX clásica, la hacemos así para poder bindear archivos

    // Creamos una PROMESA para "notificar" a las otras "pantallas" que la operación de subida de imagen ya terminó
    // "function(resuelto, rechazado" = Función de callback que tiene 2 parámetros
    return new Promise( ( resuelto , rechazado ) =>
    {
      // Añadimos un nuevo campo al formulario, para añadirle los ficheros
      // "imagen"       = Nombre del campo que le pasamos por parámetro, es lo que ponemos en la columna "key" en el POSTMAN
      // "archivo"      = Es el fichero en si, el documento
      // "archivo.name" = Nombre del Archivo
      formData.append( 'imagen', archivo , archivo.name );

      // ++++ Configuramos la petición AJAX ++++
      // "onreadystatechange" = Para que seamos notificadosp or cualquier cambio que ocurra
      // "function()"         = Función anónima, también se puede usar una función de flecha
      xhr.onreadystatechange = function()
      {
        // ---- Comprobación AJAX ----
        // Estos es como un Observable cuando está ejecutándose, vamos a estar recibiendo información cada vez que el estado cambie
        // pero sólo nos interesa un estado, el "readystate"
        // "=== 4" = Escuado ya terminó el proceso
        if ( xhr.readyState === 4 )
        {
          // El proceso se realizó correctamente, la imagen se subió corretctamente
          if ( xhr.status === 200 )
          {
            console.log('Imagen subida');
            // En este caso lo que nos devuelve es: ok, mensaje, objeto Usuario
            // "JSON.parse"   = Convertimos el string a objeto JSON
            // "xhr.response" = Decodificamos lo que nos devuelve el "xhr.response"
            resuelto( JSON.parse(xhr.response ) );
          }
          // El status no es 200, algo salió mal, no nos va a permitir hacer la petición AJAX
          else
          {
            console.log('Falló la Subida de Imagen');
            // "xhr.response" = Decodificamos lo que nos devuelve el "xhr.response"
            rechazado( xhr.response );
          }
        }
      };

      // ---- Aquí hacemos la petición AJAX ----
      // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
      // "'/upload/' + tipo + '/' + id"   = Es la ruta del Servicio para Guardar un Nuevo Usuario en BDD, Tal como lo tenemos declarado en el POSTMAN
      let url: string = EntDesarrollo.URL_ServidorNode + '/upload/' + tipo + '/' + id ;

      // "'PUT'"  = Método HTTP a utilizar
      // "url"    = A que URL vamos a hacer la petición
      // "true"   = Que le procesa sea SÍNCRONO, para asegurarnos que realmente se lleve a cabo la petición
      xhr.open('PUT' , url , true );

      // Enviamos la Petición
      xhr.send( formData );

    });
  }
}

// Alguien sugirió usar la siguuente forma, debería probarla :
// fileUpload(fileItem: File, tipo: string, id: string) {
//  const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
//  const formData: FormData = new FormData();
//  formData.append('imagen', fileItem, fileItem.name);
//  return this.http.put(url, formData, { reportProgress: true });
//  }
