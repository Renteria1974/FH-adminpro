// ++++ SERVICIOS DEL SISTEMA ++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';

// ++++ SERVICIOS CREADOS POR NOSOTROS
import { SidebarService , UsuarioService , ModalUploadService } from '../../services/service.index';

// ++++ MODELOS CREADOS POR NOSOTROS ++++++
import { Usuario } from '../../Modelos/usuario';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-sidebar',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './sidebar.component.html',  // Plantilla asociada al componente

})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class SidebarComponent implements OnInit
{
  // PROPIEDADES
  usuario: Usuario;

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _sidebar: SidebarService,
    public _servicioUsuario: UsuarioService,
    public _servicioModalUpload: ModalUploadService  // "Inyectamos" todas las funcionalidades de la clase definida en el archivo "modal-upload.service.ts"
    )
  {
  }



  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    this.usuario = this._servicioUsuario.usuario;

    // Nos “subscribimos” al observable para capturar el objeto que emite, en este caso es el usuario que se modificó
    this._servicioModalUpload.notificacion.subscribe( ( res ) =>
    {
      // Se recibe al objeto "usuarios" de tipo Usuario, el nombreestá en Plural pero realmente es la información de 1 Usuario: el que se modificó
      if ( res.usuarios )
      {
        // El Usuario que se modificó es el mismo que está logueado
        if ( res.usuarios.email === this.usuario.email )
        {
          this.usuario = res.usuarios;  // Al Usuario Logueado le damos los valores del usuario que se acaba de modificar
        }
      }
    });
  }

}
