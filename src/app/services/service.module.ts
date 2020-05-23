// Módulo donde van a cargarse todos los Componentes, directivas, diversas configuraciones para el Framework y varios módulos necesarios

// ++++++++++ MÓDULOS DEL SISTEMA ++++++++++
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
// Son los servicios que tenemos concentarados en el archivo "service.index.ts"
import {
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  LoginGuardGuard
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
    CommonModule,
    HttpClientModule
  ],

  // Se cargan ciertos servicios, configuraciones
  providers:
  [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard
  ]
})


export class ServiceModule { }
