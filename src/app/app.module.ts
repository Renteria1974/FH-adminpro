// Módulo Principal donde van a cargarse trodos los Componentes, directivas, diversas configuraciones
// para el Framework y varios módulos necesarios
// IMPORTANTE.- Todos los componentes creados en el proyecto deben registrarse aquí para que funcionen de manera global en la aplicación


// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

// Importamos las constantes que declaramos en el "app.routes.ts"
import { APP_ROUTES } from './app.routes';


// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { ServiceModule } from './services/service.module';


// ++++++++++ COMPONENTES CREADOS POR NOSOTROS ++++++++++
import { PagesModule } from './pages/pages.module';
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

  // Carga diferentes Módulos, Funcionalidades y Servicios del framework para cargarlos en la Aplicación
  imports:
  [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule  // Contiene el llamado a los servicios que estan dentro de la carpeta "services"
  ],

  // Se cargan ciertos Servicios, Configuraciones
  providers:
  [
  ],

  // Se indica el componente principal con el que la aplicación va a lanzarse
  bootstrap:
  [
    AppComponent
  ]
})
export class AppModule { }
