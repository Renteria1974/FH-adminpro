// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales

// ++++ SERVICIOS DEL SISTEMA ++++
// Importamos un Decorador Inyectable, para poder inyectar nuestra clase mediante la inyección de dependencias
// en los componentes y en diferentes sitios
import { Injectable } from '@angular/core';

// Decorador Inyectable. Definición del Componente. Con las "{}" se le pasa un Objeto JSON, no se cierra con ";" porque no es una función
// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas características concretas
// que modifican  su comportamiento, en pocas palabras, con esta declaración indicamos queesta clase la vamso a poder inyectar
// (de forma automática) como servicio en cualquier componente de la aplicación sin que se tenga que añadir en "app.module.ts"
@Injectable({
  providedIn: 'root'
})


export class SidebarService
{
  // Arreglo de objetos para controlar todas las opciones que tenga el menú lateral
  menu: any =
  [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',  // Este valor lo tomamos del archivo "sidebar.component.html"
      submenu:
      [
        // Los valores de los "url" los sacamos del archivo "pages.routes.ts" que está en la carpeta "pages"
        {titulo: 'Dashboard', url: '/dashboard'},
        {titulo: 'ProgressBar', url: '/progress'},
        {titulo: 'Gráficas', url: '/graficas1'},
        {titulo: 'Promesas', url: '/promesas'},
        {titulo: 'Rxjs', url: '/rxjs'},
      ]
    }
  ];

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor()
  {
  }


}
