// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
import { Component, OnInit } from '@angular/core';                    // Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { FormGroup, FormControl, Validators } from '@angular/forms';  // Para poder trabajar con formularios
import { Router } from '@angular/router';

// ++++++++++ COMPONENTES DE TERCEROS ++++++++++
import swal from 'sweetalert2';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { UsuarioService } from '../services/service.index';           // Llamamos  al Servicio "UsuarioService"

// ++++++++++ MODELOS CREADOS POR NOSOTROS ++++++++++
import { Usuario } from '../Modelos/usuario';



// Aquí mandamos llamar a la función "init_plugins" que declaramos en el archivo "custom.js" que está dentro de la carpeta "assets/js" y
// que nos sirve para corregir un error que se nos estaba presentando con el "sidebar"
declare function init_plugins();



// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class RegisterComponent implements OnInit
{
  // PROPIEDADES
  forma: FormGroup;
  formatoEmail: string;  // Para controlar el formato del campo "email"


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public _servicioUsuario: UsuarioService,  // Llamamos al Servicio de usuario definido en el archivo "services/Usuario/usuario.service.ts"
    public router: Router
  )
  {
    this.formatoEmail = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';  // Establecemos el formato que debe tenr el campo "email"
  }



  // <<<<<< Método ngOnInit >>>>>>
  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {
    init_plugins(); // Para que no se quede "pegado" el Componente de "carga" al momento de refrescar la página de "register"

    // "new FormGroup"        = Creamos una instancia de un "formgroup"
    // "new FormControl"      = Creamos una instancia de un Control de Formulario
    // Especificamos todos los campos que deseamos controlar en HTML (nombre, email, password, password2,)
    // "null"                 = Primer parámetro, es el valor por defecto, en este caso es "null"
    // "false"                = Primer parámetro, es el valor por defecto, en este caso es "false"
    // "Validators.required"  = Segundo parámetro, significa que el valor del campo es obligatorio
    // Validatots.email"      = Forma parte del segundo parámetro, significa que el campo tendrá el formato de "email"
    // "Validators.minLength(6)"  = Cantidad mínima de caracteres tecleados en el campo
    // Validators.maxLength(10)   = Cantidad máxima de caracteres tecleados en el campo
    this.forma = new FormGroup({
      nombre:       new FormControl( null , [ Validators.required , Validators.minLength(10) , Validators.maxLength(50) ] ),
      correo:       new FormControl( null , [ Validators.required , Validators.pattern( this.formatoEmail) ] ),
      password:     new FormControl( null , [ Validators.required , Validators.minLength(5) , Validators.maxLength(10) ] ),
      password2:    new FormControl( null , [ Validators.required , Validators.minLength(5) , Validators.maxLength(10) ] ),
      condiciones:  new FormControl( false )
    }, { validators: this.sonIguales( 'password' , 'password2' )  });

    // Llenamos el formulario con valores
    // this.forma.setValue({ nombre: 'MEMITO' , correo: 'memo@hotmail.com' , password: '123456' , password2: '123456' , condiciones: 'false' });
  }



  // <<<<<< Método que sirve para evaluar si 2 campos tipo string tienen el mismo valor >>>>>>
  sonIguales( campo1: string , campo2: string  )
  {
      // Se retorna un objeto de tipo "FormGroup"
      return ( grupo: FormGroup ) =>
      {
        let pass1 = grupo.controls[ campo1 ].value;
        let pass2 = grupo.controls[ campo2 ].value;

        // El valor de los 2 campos es el mismo
        if ( pass1 === pass2 )
        {
          return null;  // Con eso se indica que la regla de validación es positiva
        }

        // En caso de que los 2 campos tengan un valor diferente se retorna un objeto de tipo "FormGroup"
        return {
            sonIguales: true  // Esto es un error y es lo que va a impedir que el formulario sea válido
        };

      };
  }



  // <<<<<< Método para Registrar al Nuevo Usuario en BDD >>>>>>
  RegistrarUsuario()
  {
    // El formulario es inválido
    if ( this.forma.invalid )
    {
      console.log('INVALIDO');
      return;
    }

    // No se han aceptado los términos de uso
    if ( !this.forma.value.condiciones )
    {
      swal.fire('Atención!!!', 'Debe aceptar los Términos de uso.', 'warning');

      return;
    }

    // Generamos unaNueva instancia de nuestro Modelo "Usuario"
    // El resto de los campos no se ponen porque son opcionales (imagen, rol, google, _id)
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    // "_servicioUsuario" = Nuestro servicio de Usuario, colocado en "services/Usuario/suario.service.ts"
    // ".crearUsuario"    = Método para registrar al nuevo Usuario en BDD
    // ".subscribe"       = Recordemos que estamos regresando un "Observador" así que debemos "subscribirnos" par que el método "crearUsuario" se
                          // pueda "disparar"
    // "res"              = Es la repsuesta que se recibe de la ejecución del método "crearUsuario"
    this._servicioUsuario.crearUsuario( usuario )
      .subscribe( res =>
        {
          swal.fire('Correo Creado' , usuario.email , 'success');
          this.router.navigate( ['/login'] );                       // Una vez que se haya guardado el Nuevo Usuario Redireccionamos a la página de LOGIN
        },
        err =>
        {
          // "err.error.errores.message" = Obtenemos toda esta cadena del error que configuramos en el BACKEND en el registro "Usuario.js" (que está
          // dentro de la carpeta "Rutas") en el servicio APP.POST ue usamos para registrar al Nuevo Usuario en la BDD
          swal.fire('Error en el Login' , err.error.errores.message , 'error');
        });

  }

}
