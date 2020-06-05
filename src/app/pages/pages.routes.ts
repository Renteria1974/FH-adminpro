/* Este fichero se genera para que la Aplicación pueda manejar varias páginas web */

// ++++ COMPONENTES DEL SISTEMA ++++
/* Componentes o Modulos del Router */
import { RouterModule, Routes } from '@angular/router';

// ++++ COMPONETES CREADOS POR NOSOTROS ++++
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './Medicos/medico.component';

// ++++ SERVICIOS CREADOS POR NOSOTROS ++++
import { LoginGuardGuard } from '../services/Guardias/login-guard.guard';



// Constante array de Objetos de tipo "Routes" que van a contener objetos JSON de tipo "ruta" (con la configuración de la Ruta)
const pagesRoutes: Routes =
[
  {
    path: '',
    component: PagesComponent,
    canActivate: [ LoginGuardGuard ],   // Es del tipo array porque puede recibir más de un GUARD
    // Arreglo de todas las rutas hijas
    children:
    [
      { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Tablero' } },
      { path: 'progress', component: ProgressComponent, data: { titulo: 'Progreso' } },
      { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
      { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
      { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del Tema' } },
      { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de Usuario' } },
      // Mantenimientos
      { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuarios' } },
      { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales' } },
      { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Médicos' } },
      { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Actualizar Médico' } },

      /* Al cargar un path vacio haga una redirección */
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];

/* Se establece la configuración de las Rutas que se han definido
  Le decimos que Array de Rutas tiene que cargar, en este caso el "appRouts" que declaramos
  arriba para que cargue todas las rutas que nosotros indicamos
  y las introduzca e inyecte a las rutas del framework y funcione todo

  "useHash:true"  = Esto añade al a ruta un "#", que es un viejo truco de los navegadores
                    para evitar que se recargue la página
  ".forChild"     = No se usa el "forRoot" porque esta no es la ruta principal del proyecto
*/
export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
