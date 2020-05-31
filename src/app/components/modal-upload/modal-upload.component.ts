// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

// ++++++++++ COMPONENTES DE TERCEROS ++++++++++
import swal from 'sweetalert2';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { SubirArchivoService } from '../../services/SubirArchivo/subir-archivo.service';
import { ModalUploadService } from '../../services/service.index';  // './modal-upload.service';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-modal-upload',                 // Etiqueta final donde se va a cargar este componente
  templateUrl: './modal-upload.component.html'  // Plantilla asociada al componente
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class ModalUploadComponent implements OnInit
{
  // PROPIEDADES
  imagenSubir: File;                        // El archivo, documento de imagen que se va a subir al Servidor
  imagenTemp: string | ArrayBuffer;         // Para controlar la imagen que se selecciona para agregarsela al Usuario

  @ViewChild( 'inputFile' ) inputFile: any; // Para lograr borrar el nombre del archivo seleccionado a segunda vez que se abre la ventana Modal

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioSubirArchivo: SubirArchivoService,
    public _servicioModalUpload: ModalUploadService
  )
  { }



  // <<<<<< Método ngOnInit >>>>>>
  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
  }



  // <<<<<< Método para seleccionar la imagen que se seleccionó >>>>>>
  // "event" = Se recibe un archivo
  seleccionImagen( archivo: File )
  {
    // No se seleccionó ningun archivo
    if ( !archivo )
    {
      this.imagenSubir = null;
      return;                   // No hacemos nada, salimos del método
    }

    // El archivo seleccionado NO es una Imagen
    if ( archivo.type.indexOf('image') < 0 )
    {
      swal.fire('Sólo Imágenes' , 'El arhivo seleccionado NO es una Imagen' , 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo; // Nuestra propiedad toma el valor del objeto "archivo"

    // ++++ Generamos una URL temporal del archivo de imagen que hemos seleccionado
    // ---------------------------------------------
    // Código de Vanilla JavaScript
    // "FileReader()"   =  Permite que las aplicaciones web lean ficheros (o información en buffer) almacenados en el cliente de
                        // forma asíncrona, usando los objetos File o Blob dependiendo de los datos que se pretenden leer.
    // "readAsDataUrl"  = Método
    // "onloadend"      = Evento
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;
    // ---------------------------------------------

  }



  // <<<<<<  >>>>>>
  subirImagen()
  {
    this._servicioSubirArchivo.subirArchivo( this.imagenSubir , this._servicioModalUpload.tipo ,  this._servicioModalUpload.id )
      // Como nos está regresando un Promesa nos dá las opciones de "then" y "catch"
      // "res"  En caso de salir todo bien se recibe un Respuesta(res)
      .then(  res =>
      {
        // Emitimos un mensaje a todo el mundo de que ya se subió una Imagen
        this._servicioModalUpload.notificacion.emit( res );

        // En ese momento ya debemos ocultar la ventana Modal ya que ya terminamos la operación
        this.cerrarModal();

        this.limpiarFormulario(); // Limpiamos los valores del Formulario, en este caso sólo el nombre del archivo

      })
      // En caso de salir algo mal nos regresa un error(err)
      .catch( err =>
      {
        console.log('Error en la carga de la Imagen...');
      });
  }



  // <<<<<< Método para limpiar el campo "input" que contiene el nombre del archivo >>>>>>
  limpiarFormulario()
  {
    this.inputFile.nativeElement.value = '';
  }



  // <<<<<< Método que oculta la ventana Modal >>>>>>
  cerrarModal()
  {
    this.subirImagen = null;
    this.imagenTemp = null;

    this._servicioModalUpload.ocultarModal(); // Mandamos llamar al método que oculta la ventana Modal
  }


}
