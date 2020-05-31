// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit, ɵConsole } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

// ++++++++++ MÉTODOS CREADOS POR NOSOTROS ++++++++++
import { Usuario } from '../../Modelos/usuario';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../services/service.index';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-usuarios',                   // Etiqueta final donde se va a cargar este componente
  templateUrl: './usuarios.component.html'    // Plantilla asociada al componente
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class UsuariosComponent implements OnInit
{
  // PROPIEDADES
  usuarios: Usuario[] = [];   // Array de objetos Usuario
  desde: number = 0;          // Para el control del listado, indicamos desde cual Usuario deseamos mostrar el listado
  totalRegistros: number = 0; // Para el control del Listado, indica

  cargando: boolean = true;   // Para controlar el icono de carga que pusimos en el archivo HTML



  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService,        // "Inyectamos" la clase "UsuarioService" que está en el archivo "services/Usuario/usuario.service.ts"
    public _servicioModalUpload: ModalUploadService // "Inyectamos" la clase "ModalUploadServide" que está en el archivo "components/modal-upload/modal-upload.service.ts"
  )
  { }



  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    this.cargarUsuarios();  // Llamamos al método para cargar el Listado de Usuarios

    this.cargando = true;

    this.buscarporNombre(); // Se hace la búsqueda de usuarios por la cadena de búsqueda tecleada

    // Nos vamos a "subscribir" a cualquier emisión que haga la propuedad "notificacion" de la clase "modal-upload.service.ts"
    this._servicioModalUpload.notificacion
      // el "subscribe" va a recibir la respuesta de la ventana Modal, todo el objeto
      // "res" = Respuesta
      .subscribe( res => this.cargarUsuarios() );  // Lo único que nos interesa es que se recargue la página actual para que se muestre el cambio de la umagen de avatar
  }



  // <<<<<< Método que hace la búsquede de Usuarios en base a una cadena de Busqueda >>>>>>
  buscarporNombre()
  {
    // Seleccionamos el input en el documento
    const input = document.getElementById('buscaUsuario');

    // En el evento indicado para el elemento seleccionado ejecutamos los pipes y luego el subscribe
    fromEvent( input , 'input' )
      .pipe(
        // Tomamos las letras ingresadas en el input
        map(( k: KeyboardEvent ) =>
        {
            this.cargando = true;
            return k.target['value'];
        }),
        // Seleccionamos un tiempo en milisegundos (1000 = 1 seg) antes de continuar la ejecución luego de que se presionó la última letra,
        // si hay cambios en el input vuelve a empezar a contar
        debounceTime( 1000 ),
        // Ahora si ejecutamos la busqueda del usuario con el total de letras en el input
        // luego de que se dejara de escribir por 1 segundo
      ).subscribe(val =>
        {
          // Se tecleó algo
          if (val !== '')
          {
            this._servicioUsuario.buscarUsuarios( val )
              .subscribe( ( usuarios: Usuario[] ) =>
              {
                this.usuarios = usuarios;
                this.cargando = false;
              });
          }
          // No se tecleó nada, se carga el listado Normal
          else
          {
            this.cargarUsuarios();
            return;
          }
        });
  }



  // <<<<<< Método para cargar el Listado de Usuarios >>>>>>
  cargarUsuarios()
  {
    this.cargando = true; // Para que se muestre el ícono de "carga"

    // "_servicioUsuario"  = Nuestro servicio de Usuario, colocado en "services/Usuario/suario.service.ts"
    // ".cargarUsuarios"   = Método para mostrar el listado de Usuarios
    // ".subscribe"         = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "cargarUsuarios" se
                            // pueda "disparar"
    // "res"                = Es la repsuesta que se recibe de la ejecución del método "crearUsuario"
    this._servicioUsuario.cargarUsuarios( this.desde )
      // "res:any" = Respuesta, sep one de tipo "any" para que no se marque eror al especificar "res.total"
      .subscribe( ( res: any) =>
      {
        this.totalRegistros = res.total;  // Total de Usuarios del Listado
        this.usuarios = res.usuarios;     // Al Array de objetos "Usuario" le agregamos el listado que nos regresa la consulta

        this.cargando = false; // Para que se oculte el ícono de "carga", ya terminó de cargarse el listado de usuarios
      });
  }



  // <<<<<< Método para mostrar el listado de Usaurios hacia atras o hacia adelante >>>>>>
  cambiarDesde( valor: number )
  {
    let tempo = this.desde + valor;

    // El Usuario a partir del que se desea iniciar el listado de la sig. página no existe
    if ( tempo >= this.totalRegistros )
    {
      return;
    }

    // El Usuario a partir del que se desea iniciar el listado de la sig. página es inferior a "1", eso no existe
    if ( tempo < 0 )
    {
      return;
    }

    this.desde += valor;    // A nuestra propiedad local le asignamos el valor del indice del Usuario a partir del cual inicia la sig. página del Listado

    this.cargarUsuarios();  // Mostramos el listado de la Sig. página
  }



  // <<<<<< Método para Modificar la información de Registro del Usuario >>>>>>
  guardarUsuario( usuario: Usuario )
  {
    // "_servicioUsuario"   = Nuestro servicio de Usuario, colocado en "services/Usuario/suario.service.ts"
    // ".actualizarUsuario" = Método para Actualizar los datosde Registro del Usuario
    // ".subscribe"         = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "cargarUsuarios" se
                            // pueda "disparar"
    // "res"                = Es la repsuesta que se recibe de la ejecución del método "crearUsuario"
    this._servicioUsuario.actualizarUsuario( usuario )
      // ".subscribe" = Nos subscribimos al "observador" para que dispare el método "actualizarUsuario"
      .subscribe();
  }



  // <<<<<< Método para mostrar la ventana Modal para seleccionar archivo de imagen >>>>>>
  mostrarModal( id: string )
  {
    this._servicioModalUpload.mostrarModal( 'usuarios' , id );
  }

}
