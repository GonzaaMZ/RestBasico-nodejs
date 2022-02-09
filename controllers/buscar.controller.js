const { response } = require("express");
const {ObjectId} = require('mongoose').Types;

const Categoria = require('../models/categoria');
const Usuario = require("../models/usuario.modelo");
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //True

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
         return res.json({
            results: (usuario) ? [usuario] : []
        }) 
    }

    const regex = new RegExp (termino, 'i'); //Expresión regular para flexibilizar la busqueda
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    })

}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //True

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
         return res.json({
            results: (categoria) ? [categoria] : []
        }) 
    }

    const regex = new RegExp (termino, 'i'); //Expresión regular para flexibilizar la busqueda
    const categorias = await Categoria.find({ nombre: regex , estado: true });

    res.json({
        results: categorias
    })

} 

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //True

    if(esMongoID){
        const producto = await Producto.findById(termino)
                                    .populate('categoria', 'nombre');
         return res.json({
            results: (producto) ? [producto] : []
        }) 
    }

    const regex = new RegExp (termino, 'i'); //Expresión regular para flexibilizar la busqueda
    const productos = await Producto.find({ nombre: regex, estado: true  })
                                .populate('categoria', 'nombre');

    res.json({
        results: productos
    })

} 



const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;
    
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son:  ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'categorias':
            buscarCategorias(termino, res);
        break;
    
        case 'productos':
            buscarProductos(termino, res); 
        break;
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        default:
            res.status(500).json({
            msg: 'Se olvida hacer esta búsqueda'
        })
        break
    }


}




module.exports = {
    buscar,
    buscarUsuarios,
    buscarCategorias
}