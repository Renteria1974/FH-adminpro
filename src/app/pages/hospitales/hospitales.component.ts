// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../services/service.index';

// ++++++++++ MODELOS CREADOS POR NOSOTROS ++++++++++
import { Hospital } from '../../Modelos/hospital';

// ++++++++++ COMPONENTES DE TERCEROS ++++++++++
import swal from 'sweetalert2';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-hospitales',                 // Etiqueta final donde se va a cargar este componente
  templateUrl: './hospitales.component.html'  // Plantilla asociada al componente
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class HospitalesComponent implements OnInit
{
  // PROPIEDADES
  hospitales: Hospital[] = [];  // Array de objetos Hospital
  desde: number = 0;            // Para el control del listado, indicamos desde cual Hospital deseamos mostrar el listado
  totalRegistros: number = 0;   // Para el control del Listado, indica
  cargando: boolean = true;     // Para controlar el icono de carga que pusimos en el archivo HTML
  editable: string;             // Para controlar la edición del nombre del Hospital


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioHospital: HospitalService,      // "Inyectamos" la clase "HospitalService" que está en el archivo "services/Hospital/hospital.service.ts"
    public _servicioModalUpload: ModalUploadService // "Inyectamos" la clase "ModalUploadServide" que está en el archivo "components/modal-upload/modal-upload.service.ts"
  )
  { }



  // <<<<<< Método para controlar la edición del campo "nombre" >>>>>>
  activaEdicion( id: string )
  {
    this.editable = id; // A la propiedad le asifnamos el valor del ID del Hospital Seleccionado
  }



  // <<<<<< Método "ngOnInit" >>>>>>
  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    this.cargarHospitales();  // Llamamos al método para cargar el Listado de Hospitales

    this.cargando = true;

    this.buscarporNombre(); // Se hace la búsqueda de hOSPITALES por la cadena de búsqueda tecleada

    // Nos vamos a "subscribir" a cualquier emisión que haga la propiedad "notificacion" de la clase "modal-upload.service.ts"
    this._servicioModalUpload.notificacion
      // el "subscribe" va a recibir la respuesta de la ventana Modal, todo el objeto. En el método "subirImagen" del archivo "modal-upload.component.ts"
      // es donde se "emite" la respuesta que da el proceso de subir la imagen al Servidor. En este caso no hacemos uso de esa respuesta(res)
      // "() =>"" = No nos interesa la respuesta (lo que recibimos), sólo deseamos recargar el listado de Hospitales
      .subscribe( () => this.cargarHospitales() );  // Lo único que nos interesa es que se recargue la página actual para que se muestre el cambio de la imagen de avatar
  }



  // <<<<<< Método para lanzar la ventana de SWEET ALERT en donde se va a crear un Nuevo Hospital >>>>>>
  crearHospital()
  {
    // ".then( valor =>" = Recibe una Promesa con el valor ingresado
    swal.fire({
      title:                'Crear Hospital',
      text:                 'Ingrese el nombre del Hospital',
      input:                'text',
      inputAttributes:
      {
        autocapitalize:     'off'
      },
      showCancelButton:     true,
      cancelButtonText:     'Cancelar',
      confirmButtonText:    'Guardar',
      showLoaderOnConfirm:  true,
      allowOutsideClick: () => !swal.isLoading()
    }).then((valor) =>
    {
      // No se teclea nada en el campo para el nombre del Hospital o es un valor inválido
      if ( !valor.value || valor.value.length === 0) {
        return;
      }

      // Creamos el nuevo Hospital
      // "() =>" = No nos interesa la respuesta 8nos regresa el objeto Hospital quese acaba de crear), sólo actualizamos el listado de Hospitales
      this._servicioHospital.crearHospital( valor.value )
            .subscribe( () => this.cargarHospitales());
    });
  }



  // <<<<<< Método para cargar el Listado de Hospitales >>>>>>
  cargarHospitales()
  {
    this.cargando = true; // Para que se muestre el ícono de "carga"

    // "_servicioHospital"  = Nuestro servicio de Hospital, colocado en "services/Hospital/hospital.service.ts"
    // ".cargarHospitales"  = Método para mostrar el listado de Hospitales
    // ".subscribe"         = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "cargarHospitales" se
                            // pueda "disparar"
    // "res"                = Es la repsuesta que se recibe de la ejecución del método "cargarHospitales"
    this._servicioHospital.cargarHospitales( 5 , this.desde )
      // "res:any" = Respuesta, sep one de tipo "any" para que no se marque eror al especificar "res.total"
      .subscribe( ( res: any) =>
      {
        this.totalRegistros = res.total;  // Total de Hospitales del Listado
        this.hospitales = res.hospitales; // Al Array de objetos "Hospital" le agregamos el listado que nos regresa la consulta

        this.cargando = false; // Para que se oculte el ícono de "carga", ya terminó de cargarse el listado de Hospitales
      });
  }



  // <<<<<< Método que hace la búsquede de Hospitales en base a una cadena de Busqueda >>>>>>
  buscarporNombre()
  {
    // Seleccionamos la etiqueta "input" en el documento cuy ID es "buscaHospital"
    const input = document.getElementById('buscaHospital');

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
        // Ahora si ejecutamos la busqueda del Hospital con el total de letras en el input
        // luego de que se dejara de escribir por 1 segundo
      ).subscribe( val =>
        {
          // Se tecleó algo
          if (val !== '')
          {
            this._servicioHospital.buscarHospitales( val )
              .subscribe( ( hospitales: Hospital[] ) =>
              {
                this.hospitales = hospitales;
                this.cargando = false;
              });
          }
          // No se tecleó nada, se carga el listado Normal
          else
          {
            this.cargarHospitales();
            return;
          }
        });
  }



  // <<<<<< Método para Modificar la información de Registro del Hospital >>>>>>
  guardarHospital( hospital: Hospital )
  {
    // "_servicioHospital"    = Nuestro servicio de Hospital, colocado en "services/Hospital/hospital.service.ts"
    // ".actualizarHospital"  = Método para Actualizar los datos de Registro del Hospital
    // ".subscribe"           = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "cargarHospitales" se
                              // pueda "disparar"
    // "res"                  = Es la repsuesta que se recibe de la ejecución del método "crearHospital"
    this._servicioHospital.actualizarHospital( hospital )
      // ".subscribe" = Nos subscribimos al "observador" para que dispare el método "actualizarHospital"
      // No nos interesa la respuesta
      .subscribe( () => this.editable = '');  // Inhabilitamos la edición del nombre de Hospita, si es que hay uno seleccionado

  }



  // <<<<<< Método para mostrar la ventana Modal para seleccionar archivo de imagen >>>>>>
  mostrarModal( id: string )
  {
    // "hospitales" = Identificamos el tipo de imagen, pero tambien se puede poner: "usuarios" u "hospitales"
    this._servicioModalUpload.mostrarModal( 'hospitales' , id );
  }



  // <<<<<< Método para mostrar el listado de Hospitales hacia atras o hacia adelante >>>>>>
  cambiarDesde( valor: number )
  {
    let tempo = this.desde + valor;

    // El Hospital a partir del que se desea iniciar el listado de la sig. página no existe
    if ( tempo >= this.totalRegistros )
    {
      return;
    }

    // El Hospital a partir del que se desea iniciar el listado de la sig. página es inferior a "1", eso no existe
    if ( tempo < 0 )
    {
      return;
    }

    this.desde += valor;    // A nuestra propiedad local le asignamos el valor del indice del Hospital a partir del cual inicia la sig. página del Listado

    this.cargarHospitales();  // Mostramos el listado de la Sig. página
  }

}
