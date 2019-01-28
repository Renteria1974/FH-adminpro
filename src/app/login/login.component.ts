// ++++ COMPONENTES DEL SISTEMA ++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function init_plugins();


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-login',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './login.component.html',  // Plantilla asociada al componente
  styleUrls: ['./login.component.css']    // Archivo CSS asociado al componente
})

// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class LoginComponent implements OnInit
{
  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor( public router: Router )
  { }


  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    init_plugins();
  }

  // Método en el que sólo hacemos uso del "routerLink" para navegar de esta pantalla a otra
  ingresar()
  {
    this.router.navigate([ '/dashboard' ]);
  }

}