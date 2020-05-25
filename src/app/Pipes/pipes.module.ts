// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { NgModule } from '@angular/core';

// ++++++++++ PIPES CREADOS POR NOSOTROS ++++++++++
import { ImagenPipe } from './imagen.pipe';   // Pipe generado en el archivo "imagen.pipe.ts"


// Crea un Módulo, en este caso el Módulo Principal
@NgModule({
  // Aquí se declaran todos los COMPONENTES, DIRECTIVAS, PIPES para registrarlos y poder utilzarlos en la Aplicación de forma global
  declarations:
  [
    ImagenPipe
  ],

  // Carga diferentes Módulos, Funcionalidades y Servicios del framework para cargarlos en la Aplicación
  imports:
  [

  ],
  exports:
  [
    ImagenPipe
  ]

})



export class PipesModule
{

}
