const path = require('path');
const  fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario.modelo");



const cargarArchivo = async (req ,res = response) => {

    try {
        //Enviando los datos hacia la funcion (subirArchivo) para procesar el archivo
        const nombre = await subirArchivo(req.files, undefined , 'imgs');
        res.json({nombre});
        
    } catch (msg) {
        res.status(400).json({msg});        
    }
  
}


const actualizarImagen = async (req ,res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    //Preparo el modelo a guardar segun la coleccion recibida (usuario o producto)
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`
            });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`
            });
            }
            break;
        
        default:
            return res.status(500).json({
                msg: 'Opción no validada'
            })

    }

    //Limpiar imagenes repetidas y anteriores
    if (modelo.img){
        //Tomo la ruta de la imagen
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        //Compruebo si existe la imagen
        if (fs.existsSync(pathImagen) ){
            fs.unlinkSync(pathImagen); //Si existe, la elimino
        }
    }



    //Enviando los datos hacia la funcion (subirArchivo) para procesar el archivo
    const nombre = await subirArchivo(req.files, undefined , coleccion);
    
    //Asigno el archivo img en este caso al modelo
    modelo.img = nombre;

    //Guardo en DB
    await modelo.save();

    //Respuesta de mi server
    res.json(modelo);

}


const actualizarImagenCloud = async (req ,res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    //Preparo el modelo a guardar segun la coleccion recibida (usuario o producto)
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`
            });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`
            });
            }
            break;
        
        default:
            return res.status(500).json({
                msg: 'Opción no validada'
            })

    }

    //Limpiar imagenes repetidas y anteriores
    if (modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [cloudinary_id] = nombre.split('.');
        cloudinary.uploader.destroy(cloudinary_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload ( tempFilePath);
    modelo.img = secure_url;

    //Guardo en DB
    await modelo.save();

    //Respuesta de mi server
    res.json(modelo);

}


const mostrarImagen = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    //Preparo el modelo a guardar segun la coleccion recibida (usuario o producto)
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`
            });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`})
            }
            break;
        
        default:
            return res.status(500).json({
                msg: 'Opción no validada'
            })

    }

    //Limpiar imagenes repetidas y anteriores
    if (modelo.img){
        //Tomo la ruta de la imagen
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        //Compruebo si existe la imagen
        if (fs.existsSync(pathImagen) ){
            return res.sendFile(pathImagen)
        }
        
    }
    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
     return res.sendFile(pathNoImage);
    
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloud
}