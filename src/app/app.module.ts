/* Módulo Principal donde van a cargarse trodos los Componentes, directivas, diversas configuraciones
para el Framework y varios módulos necesarios
 IMPORTANTE.- Todos los componentes creados en el proyecto deben registrarse aquí para que funcionens de manera global en la aplicación
*/

// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Importamos las constantes que declaramos en el "app.routes.ts"
import { APP_ROUTES } from './app.routes';


// ++++++++++ COMPONENTES CREADOS POR NOSOTROS ++++++++++
import { PageModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';


// Crea un Módulo, en este caso el Módulo Principal
@NgModule({
  // Aquí se declaran todos los COMPONENTES, DIRECTIVAS, PIPES para registrarlos y poder utilzarlos en la Aplicación de forma global
  declarations:
  [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  // Carga diferentes módulos, funcionalidades y servicios del framework para cargarlos en la Aplicación
  imports:
  [
    BrowserModule,
    APP_ROUTES,
    PageModule
  ],
  // Se cargan ciertos Servicios, Configuraciones
  providers: [],
  // Se indica el componente principal con el que la aplicación va a lanzarse
  bootstrap: [AppComponent]
})
export class AppModule { }
