// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { Component, OnInit } from '@angular/core';

// ++++++++++ MODELOS CREADOS POR NOSOTROS ++++++++++
import { Usuario } from '../../Modelos/usuario';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../../services/service.index';
import { SubirArchivoService } from '../../services/SubirArchivo/subir-archivo.service';

// ++++++++++ SERVICIOS DE TERCEROS ++++++++++
import swal from 'sweetalert2';


// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-profile',                  // Etiqueta final donde se va a cargar este componente
  templateUrl: './profile.component.html'   // Plantilla asociada al componente
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class ProfileComponent implements OnInit
{
  // PROPIEDADES
  usuario: Usuario;
  imagenSubir: File;                // El archivo, documento de imagen que se va a subir al Servidor
  imagenTemp: string | ArrayBuffer; // Para controlar la imagen que se selecciona para agregarsela al Usuario

  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService
  )
  {
    this.usuario = this._servicioUsuario.usuario; // Asignamos la Instanciade Usuario
  }



  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
  }



  // <<<<<< Método para guardar los cambios en la BDD >>>>>>
  // "usuario: Usuario" = Recibimos un objeto de tipo Usuario
  guardarCambios( usuario: Usuario )
  {
    // Asignamos los nuevos valores de lso camos a nuestro objeto "Usuario"
    this.usuario.nombre = usuario.nombre;
    // Sólo si no es un Usuario con Autenticación de Google permitimos que se cambie el valor del "email". Esto es reforzar el candado, porque en el HTML
    // se supone que el input EMAIL se deshabilitó
    if ( !this.usuario.google )
    {
      this.usuario.email  = usuario.email;
    }

    // "_servicioUsuario"   = Nuestro servicio de Usuario, colocado en "services/Usuario/suario.service.ts"
    // ".actualizarUsuario" = Método para actualizar en BDD losdatos del Usuario
    // ".subscribe"         = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "crearUsuario" se
                            // pueda "disparar"
    // "res"                = Es la repsuesta que se recibe de la ejecución del método "crearUsuario"
    this._servicioUsuario.actualizarUsuario( this.usuario )
      .subscribe( () => {}, () =>
      {
        // Despues de actualizar la BDD se verifica si el valor que tiene el EMAIL en el LocalStorage es diferente al que se tiene en la propiedad LOCAL
        // si es así a la propiedad local sele da el valor del LocalStorage, esto es porque se notó que en los casos en que se queria modificar el email
        // y se deseaba poner uno que ya tiene otro Usuario lógicamente serechaza esecambio pero en la información del Usuario que se tiene en el icono
        // de la foto de la parte usperior derecha del Navegador se escribí ese email que se estaba rechazando
        if ( this.usuario.email !== JSON.parse( localStorage.getItem('usuario')).email )
        {
          this.usuario.email = JSON.parse( localStorage.getItem('usuario')).email;
        }
      });
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



  // <<<<<< Método para cambiar la imagen del Usuario >>>>>>
  cambiarImagen()
  {
    // "_servicioUsuario"   = Instancia de la Clase definida en el archivo "usuario.service.ts"
    // ".cambiarImagen"     = Método que definimos en el archivo "usuario.service.ts"
    // "this.imagenSubir"   = Es el archivo, el documento que queremos subir al Servidor
    // "this.usuario._id "  = Para este caso mandamos el ID del Usuario logueado actualmente
    this._servicioUsuario.cambiarImagen( this.imagenSubir , this.usuario._id );
  }

}
