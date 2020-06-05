// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router , ActivatedRoute } from '@angular/router';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { MedicoService , HospitalService , ModalUploadService } from '../../services/service.index';

// ++++++++++ MODELOS CREADOS POR NOSOTROS ++++++++++
import { Hospital } from '../../Modelos/hospital';
import { Medico } from '../../Modelos/medico';




// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-medico',                 // Etiqueta final donde se va a cargar este componente
  templateUrl: './medico.component.html'  // Plantilla asociada al componente
})


// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class MedicoComponent implements OnInit
{
  // PROPIEDADES
  hospitales: Hospital[] = [];
  medico: Medico = new Medico( '' , '' , null , null , '' , true ); // No lo inicializamos porque todos sus valores son opcionales (así lo definimos en el Modelo)
  hospital: Hospital = new Hospital('');                            // Sólo el campo "nombre" es obligatorio, por eso le ponemos las comillas


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioMedico: MedicoService,
    public _servicioHospital: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,          // Agregamos el “ActivatedRoute”, es para poder leer el ID del Médico que estamoS mandando por la URL
    public _servicioModalUpload: ModalUploadService
  )
  {
    // Observable al cual nos podemos "subscribir"
    // "params" = Aquí se encuentran todos los parámetros que se han definido en la ruta
    activatedRoute.params.subscribe( params =>
    {
      let id = params['id'];  // Obtenemos el "ID" que estamos mandando por la URL, sabemos que se llama "id" porque en la definición de la ruta
                              // (archivo "pages.routes.ts") ese nombre le dimos al parámetro: 'medico/:id'
      // No estamos en la operación de NUEVO MEDICO
      if ( id !== 'nuevo' )
      {
        this.cargarMedico( id );  // Obtenemos los datos del Médico para poder modificarlos
      }
    });
  }


  // <<<<<< Método "ngOnInit" >>>>>>
  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    this._servicioHospital.cargarHospitales( 0 )
      .subscribe( (res: any ) =>
      {
        this.hospitales = res.hospitales; // A nuestro array de HOSPITALES le asignamos lo que nos regresa el método "cargarHospitales"
      });

    // Nos vamos a "subscribir" a cualquier emisión que haga la propiedad "notificacion" de la clase "modal-upload.service.ts"
    this._servicioModalUpload.notificacion
    // el "subscribe" va a recibir la respuesta de la ventana Modal, todo el objeto. En el método "subirImagen" del archivo "modal-upload.component.ts"
    // es donde se "emite" la respuesta que da el proceso de subir la imagen al Servidor. En este caso no hacemos uso de esa respuesta(res)
    // "res" = Recibimos una Respuesta(res) o una Data actualizada de la Imagen, en este caso nos regresa mensajes y el objeto "Medico" actualizado
    .subscribe( res =>
    {
      this.medico.img = res.medicos.img;  // A nuestra propiedad "img" del objeto "medico" le asignamos la propiedad "img" del objeto "medico" que viene en la respuesta
    });
  }



  // <<<<<< Método para Guardar en Crear o Modificar el registro de un Médico en BDD >>>>>>
  guardarMedico( f: NgForm )
  {
    // Los datos del formulario son inválidos
    if ( f.invalid)
    {
      return;
    }

    // Creamos el nuevo Médico
    this._servicioMedico.guadarMedico( this.medico )
      .subscribe( medico =>
        {
          this.medico._id = medico._id;

          this.router.navigate( ['/medico' , medico._id ] );  // Navegamos a la ventana de EDICIÓN de los médicos
        });
  }



  // <<<<<< Método que se ejecuta cada vez que se selecciona un elemento del Listado de Hospitales >>>>>>
  // "id" = Es el ID del Hospital seleccionado
  cambioHospital( id: string )
  {
    // Siempre y cuando se haya seleccionado un elemento del Listado
    if (id != 'null')
    {
      this._servicioHospital.obtenerHospital( id )
        .subscribe( hospital =>
          {
            this.hospital = hospital;                 // A nuestro arreglo de Hospitales le asignamos
            this.medico.hospital.img = hospital.img;  // Para que se pueda mostrar en pantalla la imagen del Hospital
          });
    }
    else
    {
      this.hospital.img = 'XXXX'; // Para que en pantalla se coloque la imagen "general"
    }
  }



  // <<<<<< Método para obtener los datos de Registro de un Médico >>>>>>
  cargarMedico( id: string )
  {
    this._servicioMedico.obtenerMedico( id )
      .subscribe( medico =>
        {
          this.medico = medico;                             // A Nuestra propiedad "medico" se le asigna el objeto "medico" que nos regresa el método "obtenerMedico"
          // this.cambioHospital( this.medico.hospital._id );  // Para que se cargue la magen del Hospital
        });
  }



  // <<<<<< Método para mostrar la ventana Modal para seleccionar archivo de imagen >>>>>>
  mostrarModal()
  {
    // "medicos" = Identificamos el tipo de imagen, pero tambien se puede poner: "usuarios" u "hospitales"
    this._servicioModalUpload.mostrarModal( 'medicos' , this.medico._id );
  }
}
