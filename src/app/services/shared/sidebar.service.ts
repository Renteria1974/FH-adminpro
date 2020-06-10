// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ SERVICIOS DEL SISTEMA ++++
// Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
// en los componentes y en diferentes sitios
import { Injectable } from '@angular/core';

// ++++ SERVICIOS CREADOS POR NOSOTROS ++++
import { UsuarioService } from '../Usuario/usuario.service';


// Decorador Inyectable. Definición del Componente. Con las "{}" se le pasa un Objeto JSON, no se cierra con ";" porque no es una función
// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas características concretas
// que modifican  su comportamiento, en pocas palabras, con esta declaración indicamos queesta clase la vamso a poder inyectar
// (de forma automática) como servicio en cualquier componente de la aplicación sin que se tenga que añadir en "app.module.ts"
@Injectable({
  providedIn: 'root'
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que
// las 2 se pueden "imprimir" sin ningun problema, se la salta, aunque por buena costumbre de
// programación hacer buen uso de ese tipo de declaraciones
export class SidebarService
{
  // PROPIEDADES
  menu: any[] = [];


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService
  )
  {
  }



  // <<<<<< Método para cargar generar el Menú Lateral Izquierdo desde el BACKEND >>>>>>
  cargarMenu()
  {
    this.menu = this._servicioUsuario.menu; // Creamos el menú lateral izquierdo en base al tipo de Usuario que está logueado
  }


}
