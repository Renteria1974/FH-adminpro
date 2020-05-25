// Un PIPE nos permite a nosotros transformar la información visualmente... es como para aplicar un formato de moneda, fecha, capitalizar palabras
// ... pero internamente el valor no cambia, sólo visualmente

// ++++ MÓDULOS DEL SISTEMA ++++
import { Pipe, PipeTransform } from '@angular/core';

// ++++ ARCHIVOS DE CONFIGURACIÓN DEL SISTEMA ++++
import { EntDesarrollo } from '../../environments/environment';



@Pipe({
  name: 'imagen'
})



export class ImagenPipe implements PipeTransform
{
  // "imagen" = Si es un usuario autenticado con GOOGLE entonces es la URL de la imagen, si es un usuario "Normal" entonces es el nombre del archivo con su extensión
  // "tipo"   = Se especifica si es: Hospital, Médico, Usuario. Por defecto va a ser de tipo "usuario"
  transform( imagen: string , tipo: string = 'usuario' ): any
  {
    // "EntDesarrollo.URL_ServidorNode" = Constante definida en el archivo "environments/environment.ts" que contiene la URL base de nuestro Servidor Node Local
    // "'/img'"                         = Es la cosntante que lleva cualquier imagen ya sea: Usuario, Médico, Hospital. sólo es parte de la Ruta
    let url: string = EntDesarrollo.URL_ServidorNode + '/img';

    // No se recibe ninguna imagen
    if ( !imagen )
    {
      return url + '/usuarios/xxxx';  // Al haceresto entonces se regresa una imagen "por defecto", una de tipo general para estos casos
    }

    // Es uan imagen de GOOGLE (porque trae la dirección URL)
    // "indexOf" = Regresa el primer índiceen el que se encuentra el elemento buscado, es >=0, si no lo encuentra regresa -1
    if ( imagen.indexOf('https') >= 0 )
    {
      return imagen;
    }

    // La imagen puede ser de uno de los 3 tipos siguientes
    switch ( tipo )
    {
      case 'usuario':
        url += '/usuarios/' + imagen;
        break;

      case 'medico':
        url += '/medicos/' + imagen;
        break;

      case 'hospital':
        url += '/hospitales/' + imagen;
        break;

      // Si se envía un tipo de imagen que no existe
      default:
        console.log('Tipo de imagen NO existe, usuario, medico, hospital');
        url += '/usuarios/xxxx';
    }

    return url;

  }

}
