const Role = require("../models/role")
const Usuario = require("../models/usuario.modelo");
const Categoria = require('../models/categoria');
const Producto = require("../models/producto");


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
     const existeUsuario = await Usuario.findById(id, {estado : true});
    if (!existeUsuario){
          throw new Error(`El id no existe ${id}`);
      }
    }



/*
Categorias
*/ 

//Verificar si la categoria existe utilizando su id de mongo
const existeCategoriaById = async (id) => {
    const existeCategoria = await Categoria.findById(id);
   if (!existeCategoria){
         throw new Error(`El id no existe ${id}`);
     }
   }



   /*
   Productos
   */ 
   const existeProductoById = async (id) => {
    const existeProducto = await Producto.findById(id);
   if (!existeProducto){
         throw new Error(`El id no existe ${id}`);
     }
   }
 

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if (!incluida){
        throw new Error(`La coleccion ${coleccion} no existe - ${colecciones}`)
    }
    return true;
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioById,
    existeCategoriaById,
    existeProductoById,
    coleccionesPermitidas
}