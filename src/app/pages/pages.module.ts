// Módulo donde van a cargarse trodos los Componentes, directivas, diversas configuraciones
// para el Framework y varios módulos necesarios


import { NgModule } from '@angular/core';

// ++++++++++ COMPONENTES CREADOS POR NOSOTROS ++++++++++
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';


// Crea un Módulo
@NgModule({
  // Aquí se declaran todos los COMPONENTES, DIRECTIVAS, PIPES para registrarlos y poder utilzarlos en la Aplicación de forma global
  declarations:
  [
     DashboardComponent,
     ProgressComponent,
     Graficas1Component,
     PagesComponent
  ],
  // Para poder usar estas páginas (las declaradas en "declarations") por ostros componentes que se encuentran fuera de este módulo
  exports:
  [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    PagesComponent
  ],
  // Carga diferentes módulos, funcionalidades y servicios del framework para cargarlos en la Aplicación
  imports:
  [
    SharedModule,   // Hace referencia a la clase creada en el archivo "share.module.ts" dentro de la carpeta "shared"
    PAGES_ROUTES    // Constante creada en el archivo "pages.routes.ts"
  ],

})

export class PageModule { }
