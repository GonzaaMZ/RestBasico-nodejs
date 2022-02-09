const { response } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const Producto = require('../models/producto');


//obtenerCategorias - paginado - total - populate

const obtenerProductos = async (req, res = response) => {
    
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    ])

    res.json({
        total,
        productos
    })

}


//obtenerCategoria - populate {}

const obtenerProducto = async (req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');


    res.json({
        producto
    })

}



const crearProducto = async (req, res = response) => {

    const {estado, usuario, ...body} = req.body;
    
    const productoDB = await Producto.findOne({nombre: body.nombre});
        
        if(productoDB){
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe`
            });
        }
        
        //Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }
        
        const producto = new Producto(data);
        
        //Guardar en BD
       await producto.save();
        
       return res.status(201).json(producto);
        
        
    }
    
//actualizarCategoria

const actualizarProducto = async (req, res = response) => {

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if (data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new : true});

    res.json(producto)


}



//borrarCategoria - estado: false

const borrarProducto = async (req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado : false}, {new: true});

    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}