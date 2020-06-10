// ++++++++++ COMPONENTES DEL SISTEMA ++++++++++
// Importamos el Móduo COMPONENT que nos permite crear un Componente y poder hacer uso del Decorador, Etc.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { EntDesarrollo  } from '../../../environments/environment';


// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { Usuario } from '../../Modelos/usuario';
import { Medico } from '../../Modelos/medico';
import { Hospital } from '../../Modelos/hospital';



// El Decorador lo que hace es aportar una Funcionalidad a una clase (que se define abajo), darle unas
// características concretas que modifican su comportamiento
@Component({
  selector: 'app-busqueda',                 // Etiqueta final donde se va a cargar este componente
  templateUrl: './busqueda.component.html'  // Plantilla asociada al componente
})



// Clase. Necesaria la palabra "export" para indicar que se pueda utilizar en otros ficheros
// NOTA: Si definimos una propiedad como PUBLIC o PRIVATE a typescript no le importa ya que las 2
// se pueden "imprimir" sin ningun problema, se la salta,
// aunque por buena costumbre de programación hacer buen uso de ese tipo de declaraciones
export class BusquedaComponent implements OnInit
{
  // PROPIEDADES
  // Los siguientes3 arreglos son para la descarga de coincidencias en cada tipo de colección
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];


  // CONSTRUCTOR : Es el primer método que se lanza al instanciar un objeto o instanciar la clase. Al llamar al componente
  // lo primero en ejecutarse es el Constructor.
  // Se utiliza para inicializar las propiedades de la clase, asignarles un valor o hacer una pequeña configuración
  constructor(
    public activatedRoute: ActivatedRoute,  // Para poder recibir un parámetro por el URL
    public http: HttpClient
  )
  {
    activatedRoute.params
      .subscribe( params =>
      {
        // Vamos a obtener el del parámetro (lo que tecleamos en el campob de "busqueda") que definimos en el archivo "pages.routes.ts" en la ruta: 'busqueda/: termino'
        let termino = params['termino'];

        this.buscar( termino ); // Lanzamos la búsqueda en todas las colecciones
      });

  }


  // Se ejecuta cuando se carga el componente y se muestra en pantalla, sólo se ejecuta una vez: al cargar el componente por primera vez
  // se ejecuta despues de "ngOnChanges"
  ngOnInit()
  {

  }



  // <<<<<< Método para hacer una búsqueda en las colecciones: Usuarios, Medicos y Hospitales >>>>>>
  buscar( termino: string )
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "Config/Config.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/busqueda/todo' + termino"     = Es la ruta del Servicio para la Búsqueda en todas las "colecciones (Usuarios, Medicos, Hospitales",
                                        //  Tal como lo tenemos declarado en el POSTMAN
    let url: string = EntDesarrollo.URL_ServidorNode + '/busqueda/todo/' + termino;

    // --- BÚSQUEDA EN TODAS LAS COLECCIONES (Usuarios, Medicos, Hospitales) ----
    // return       = Deseamos ser notificados cuando se ejecute nuestro método PUT. Regresamos un "Observador" al cual nos vamos a poder subscribir
    // ".put"       = Porque la petición usada es un PUT
    // "url"        = URL completa de la Petición
    this.http.get( url )
      // "res" = Recibimos una respuesta, recordemos que nos regresa array de objetos JSON de cada colección
      .subscribe( (res: any) =>
      {
        this.usuarios = res.usuarios;
        this.hospitales = res.hospitales;
        this.medicos = res.medicos;
      });
  }

}
