// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales


// ++++ SERVICIOS CREADOS POR NOSOTROS ++++
// "export" = Exportamos los servicios, dem anera que si el día de mañana estos archivos se mueven a otra carpeta entonces
//            sólo modificamos el llamado en este lugar porque sólo aquí se tiene la referencia directa al path de su ubicación
export { SettingsService} from './settings/settings.service';
export { SharedService } from './shared/shared.service';
export { SidebarService } from './shared/sidebar.service';