/* Este fichero se genera para que la Aplicación pueda manejar varias páginas web */


/* Componentes o Modulos del Router */
import { RouterModule, Routes } from '@angular/router';

/* ++++++++++ COMPONENTES CREADOS POR NOSOTROS ++++++++++ */
import { PagesComponent } from './pages/pages.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { Graficas1Component } from './pages/graficas1/graficas1.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';

/* Constante array de Objetos de tipo "Routes" que van a contener objetos
JSON de tipo "ruta" (con la configuración de la Ruta) */
const appRouts: Routes =
[
  {
    path: '',
    component: PagesComponent,
    // Arreglo de todas las rutas hijas
    children:
    [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'graficas1', component: Graficas1Component },
      /* Al cargar un path vacio haga una redirección */
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* Cuando se produzca un error al no existir el componente que estamos indicando por la URL que cargue otro Componente por defecto */
  {path: '**', component: NopagefoundComponent}
];


/* Se establece la configuración de las Rutas que se han definido
  Le decimos que Array de Rutas tiene que cargar, en este caso el "appRouts" que declaramos
  arriba para que cargue todas las rutas que nosotros indicamos
  y las introduzca e inyecte a las rutas del framework y funcione todo

  useHash:true = Esto añade al a ruta un "#", que es un viejo truco de los navegadores
                  para evitar que se recargue la página
*/
export const APP_ROUTES = RouterModule.forRoot(appRouts, { useHash: true } );

