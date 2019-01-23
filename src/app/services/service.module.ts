// Módulo donde van a cargarse trodos los Componentes, directivas, diversas configuraciones para el Framework y varios módulos necesarios

// ++++ COMPONENTES DEL SISTEMA
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// ++++ SERVICIOS CREADOS POR NOSOTROS
import {
  SettingsService,
  SidebarService,
  SharedService
 } from './service.index';


// CREA UN MÓDULO
@NgModule({
  // Aquí se declaran todos los COMPONENTES, DIRECTIVAS, PIPES para registrarlos y poder utilzarlos en la Aplicación de forma global
  declarations:
  [

  ],

  // Carga diferentes módulos, funcionalidades y servicios del framework para cargarlos en la Aplicación
  imports:
  [
    CommonModule
  ],

  // Se cargan ciertos servicios, configuraciones
  providers:
  [
    SettingsService,
    SidebarService,
    SharedService
  ]
})


export class ServiceModule { }
