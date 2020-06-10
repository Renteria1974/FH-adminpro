// ******** ESTO ES UN SERVICIO *********
// Los servicios son  clases con un objetivo claro que nos facilitan la reutilización del código. Son un tipo de Componente o parte
// de la arquitectura de una Aplicación que nos va a permitir separar un poco de Lógica del componente sobre todo en trabajo
// con APIS, HTTP, Funcionalidades complejas y mediante la inyección de dependencias podemos utilizarlos en otros componentes principales


// ++++ SERVICIOS CREADOS POR NOSOTROS ++++
// "export" = Exportamos los servicios, de manera que si el día de mañana estos archivos se mueven a otra carpeta entonces
//            sólo modificamos el llamado en este lugar porque sólo aquí se tiene la referencia directa al path de su ubicación
export { LoginGuardGuard } from './Guardias/login-guard.guard';
export { AdminGuard } from './Guardias/admin.guard';
export { SettingsService } from './settings/settings.service';
export { SharedService } from './shared/shared.service';
export { SidebarService } from './shared/sidebar.service';
export { UsuarioService } from './Usuario/usuario.service';
export { SubirArchivoService } from './SubirArchivo/subir-archivo.service';
export { ModalUploadService } from '../components/modal-upload/modal-upload.service';
export { HospitalService } from './Hospital/hospital.service';
export { MedicoService } from './Medico/medico.service';

