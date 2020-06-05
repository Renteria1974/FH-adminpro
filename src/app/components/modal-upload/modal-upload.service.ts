// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ COMPONENTES DEL SISTEMA ++++
import { Injectable, EventEmitter } from '@angular/core'; // Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
                                                          // en los componentes y en diferentes sitios

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
export class ModalUploadService
{
  // PROPIEDADES
  public tipo: string;              // Identificar si la imagen es para: usuario, médico, hospital
  public id: string;                // El ID del médico o del usuario o del Hospital

  public oculto: string = 'oculto'; // Para controlar si está visible u oculta la ventana Modal, por defecto tiene que estar oculto

  // Para poder emitir y que los otros componentes que usan este servicio se puedan "subscribir" para estar escuchando cuando se sube la imagen
  // Es para que la ventana "Modal" notifique a las otras pantallas que ya se subió una imagen
  // "<any>" = Es el objeto Respuesta del Servicio de Carga de Imágenes, es decir, se puede regresar cualquier cosa (un JSON, un booleano, string, etc.)
  public notificacion = new EventEmitter<any>();


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor()
  {
    console.log('Modal Upload Listo');
  }



  // <<<<<< Método para ocultar la ventana Modal >>>>>>
  ocultarModal()
  {
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;
  }



  // <<<<<< Método para lograr que sea visible la ventana Modal >>>>>>
  // "tipo" = Puede ser: usuario, medico, hospital
  // "id"   = es el ID del usuario, hospital o medico
  mostrarModal( tipo: string , id: string )
  {
    this.oculto = '';
    this.tipo = tipo;
    this.id = id;
  }

}
