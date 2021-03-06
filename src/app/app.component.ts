// ++++ Este es el COMPONENTE Principal de la Aplicación, es el primer COMPONENTE en cargarse y da soporte a otros tantos COMPONENTES ++++

// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
// Importamos el Móduo COMPONENT que permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component } from '@angular/core';


// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { SettingsService } from './services/service.index';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas características
// concretas que modifican su comportamiento
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2 se pueden
// "imprimir" sin ningun problema, se la salta, aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
// "OnInit, DoCheck" = Implementamos una interface que nos va a proporcionar un metodo, un hook en nuestro componente
export class AppComponent
{
  title = 'adminpro';

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente lo primero
  //              en ejecutarse es el Constructor. Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer
  //             una pequeña configuración

  // "public _ajustes: SettingsService" = Inyectamos el servicio "settings.service.ts" que contiene la configuración de color de fondo
  //                                       del Encabezado del Menú Principal que definimos
  constructor( public _ajustes: SettingsService)
  {

  }


}
