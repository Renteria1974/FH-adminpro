// Este fichero se genera para que la Aplicación pueda manejar varias páginas web
// ++++++++++ COMPONENTES CREADOS POR NOSOTROS ++++++++++
import { Routes , RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { PagesComponent } from './pages/pages.component';

// ++++++++++ SERVICIOS CREADOS POR NOSOTROS ++++++++++
import { LoginGuardGuard } from './services/service.index';



// Constante array de Objetos de tipo "Routes" que van a contener objetos
// JSON de tipo "ruta" (con la configuración de la Ruta) */
const appRouts: Routes =
[
  { path: 'login' , component: LoginComponent },
  { path: 'register' , component: RegisterComponent },
  {
    path: '',
    component: PagesComponent,
    canActivate: [ LoginGuardGuard ],
    loadChildren: './pages/pages.module#PagesModule'
  },

  /* Cuando se produzca un error al no existir el componente que estamos indicando por la URL que cargue otro Componente por defecto */
  // El Componente "Error" siempre debe ser el último que se declara, esto es a lo que sel lama: "RUTA 404"
  // Cuando se produzca un error al no existir el componente que estamos indicando por la URL que cargue otro Componente por defecto
  { path: '**' , component: NopagefoundComponent }
];


/* Se establece la configuración de las Rutas que se han definido
  Le decimos que Array de Rutas tiene que cargar, en este caso el "appRouts" que declaramos
  arriba para que cargue todas las rutas que nosotros indicamos
  y las introduzca e inyecte a las rutas del framework y funcione todo

  useHash:true = Esto añade a la ruta un "#", que es un viejo truco de los navegadores
                  para evitar que se recargue la página
*/
export const APP_ROUTES = RouterModule.forRoot( appRouts , { useHash: true } );

