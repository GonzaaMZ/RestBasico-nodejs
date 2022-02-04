const Role = require("../models/role")
const Usuario = require("../models/usuario.modelo");


const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

//Verificar si el correo existe
const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`El correo: ${correo} ya existe`);
        }
    }

//Verificar si existe usuario utilizando su id de mongo
 const existeUsuarioById = async (id) => {
     const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
          throw new Error(`El id no existe ${id}`);
      }
    }


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioById
}