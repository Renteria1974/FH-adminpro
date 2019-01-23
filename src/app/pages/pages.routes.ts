/* Este fichero se genera para que la Aplicación pueda manejar varias páginas web */

/* Componentes o Modulos del Router */
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';



const pagesRoutes: Routes =
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
      { path: 'account-settings', component: AccountSettingsComponent },
      /* Al cargar un path vacio haga una redirección */
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];

/* Se establece la configuración de las Rutas que se han definido
  Le decimos que Array de Rutas tiene que cargar, en este caso el "appRouts" que declaramos
  arriba para que cargue todas las rutas que nosotros indicamos
  y las introduzca e inyecte a las rutas del framework y funcione todo

  useHash:true = Esto añade al a ruta un "#", que es un viejo truco de los navegadores
                  para evitar que se recargue la página
  .forChild  = No se usa el "forRoot" porque esta no es la ruta principal del proyecto
*/
export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
