// Módulo donde van a cargarse trodos los Componentes, directivas, diversas configuraciones
// para el Framework y varios módulos necesarios

// ++++ COMPONENTES DEL SISTEMA
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// ++++ COMPONENTES CREADOS POR NOSOTROS ++++
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';



// CREA UN MÓDULO
@NgModule({
  // Aquí se declaran todos los COMPONENTES, DIRECTIVAS, PIPES para registrarlos y poder utilzarlos en la Aplicación de forma global
  declarations:
  [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    NopagefoundComponent
  ],

  // Carga diferentes módulos, funcionalidades y servicios del framework para cargarlos en la Aplicación
  imports:
  [
     RouterModule,
     CommonModule
  ],
  // Para poder usar estas páginas (las declaradas en "declarations") por otros componentes que se encuentran fuera de este módulo
  exports:
  [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    NopagefoundComponent
  ]

})

export class SharedModule { }
