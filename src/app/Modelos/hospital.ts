// MODELO DE "HOSPITAL"
// Un Modelo es una entidad, un objeto que va a representar a un documento de la BDD, a un objeto de tipo concreto

import { Usuario } from './usuario';  // Importamos el modelo de "Usuario"

// Aquí definimos una clase
export class Hospital
{
  // Podemos definir las propiedades aquí porque es un atajo que nos da TYPESCRIPT, con esto nos saltamos de golpe 3 pasos
  // que de otra formase tedrian que hacer para que funcionara de la misma manera: 1.- Definir la propiedad
  // 2.- Luego tendriamos que pasarle un dato como parametro al constructor 3.- Inicializar la propiedad
  constructor (
      public nombre:    string,
      public img?:      string, // Una vez que un campo se pone como opcional ("?") los campos que le siguen tambien deben ser opcionales
      public usuario?:  Usuario,
      public _id?:      string,
      public activo?:   boolean
  ) { }

}
