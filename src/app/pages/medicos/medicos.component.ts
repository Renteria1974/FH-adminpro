// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

// ++++++++++ COMPONENTES CREADOS POR NOSOTROS ++++++++++
import { Medico } from '../../Modelos/medico';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { ModalUploadService , MedicoService } from '../../services/service.index';



// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-medicos',                // Etiqueta final donde se va a cargar este componente
  templateUrl: './medicos.component.html' // Plantilla asociada al componente
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class MedicosComponent implements OnInit
{
  // PROPIEDADES
  medicos: Medico[] = [];       // Array de objetos Hospital
  desde: number = 0;            // Para el control del listado, indicamos desde cual Hospital deseamos mostrar el listado
  totalRegistros: number = 0;   // Para el control del Listado, indica
  cargando: boolean = true;     // Para controlar el icono de carga que pusimos en el archivo HTML
  editable: string;             // Para controlar la edición del nombre del Hospital

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public http: HttpClient,                          // Para poder hacer peticiones HTTP
    public _servicioModalUpload: ModalUploadService,  // "Inyectamos" la clase "ModalUploadServide" que está en el archivo "components/modal-upload/modal-upload.service.ts"
    public _servicioMedico: MedicoService,            // "Inyectamos" la clase "MedicoService" que está en el archivo "services/Medico/medico.service.ts"
  )
  { }



  // <<<<<< Método para controlar la edición del campo "nombre" >>>>>>
  activaEdicion( id: string )
  {
    this.editable = id; // A la propiedad le asignamos el valor del ID del Hospital Seleccionado
  }



  // <<<<<< Método "ngOnInit" >>>>>>
  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    this.cargarMedicos();  // Llamamos al método para cargar el Listado de Médicos

    this.cargando = true;

    this.buscarporNombre(); // Se hace la búsqueda de hOSPITALES por la cadena de búsqueda tecleada
  }



  // <<<<<< Método que hace la búsquede de Médicos en base a una cadena de Busqueda >>>>>>
  buscarporNombre()
  {
    // Seleccionamos la etiqueta "input" en el documento cuy ID es "buscaHospital"
    const input = document.getElementById('buscaMedico');

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
            this._servicioMedico.buscarMedicos( val )
              .subscribe( ( medicos: Medico[] ) =>
              {
                this.medicos = medicos;
                this.cargando = false;
              });
          }
          // No se tecleó nada, se carga el listado Normal
          else
          {
            this.cargarMedicos();
            return;
          }
        });
  }



  // <<<<<< Método para cargar el Listado de Hospitales >>>>>>
  cargarMedicos()
  {
    this.cargando = true; // Para que se muestre el ícono de "carga"

    // "_servicioMedico"  = Nuestro servicio de Medico, colocado en "services/Medico/medico.service.ts"
    // ".cargarMedicos"   = Método para mostrar el listado de Médicos
    // ".subscribe"       = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "cargarMedicos" se
                          // pueda "disparar"
    // "res"              = Es la repsuesta que se recibe de la ejecución del método "cargarMedicos"
    this._servicioMedico.cargarMedicos( this.desde )
      // "res:any" = Respuesta, se pone de tipo "any" para que no se marque eror al especificar "res.total"
      .subscribe( ( res: any) =>
      {
        this.totalRegistros = res.total;  // Total de Medicos del Listado
        this.medicos = res.medicos;       // Al Array de objetos "Medico" le agregamos el listado que nos regresa la consulta

        this.cargando = false;            // Para que se oculte el ícono de "carga", ya terminó de cargarse el listado de Médicos
      });
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

    this.cargarMedicos();  // Mostramos el listado de la Sig. página
  }

}
