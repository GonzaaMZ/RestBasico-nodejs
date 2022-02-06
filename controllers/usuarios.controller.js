const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.modelo');



const usuariosGet = async (req, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});


    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar en DB
    await usuario.save();

    

    res.json({
        usuario
    })
}

const usuariosPut =async (req, res) => {
    
    const {id} = req.params;
    const { password, google, correo, ...resto} = req.body;

    //TODO validar contra base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    })
}

const usuariosDelete = async (req, res) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    
    res.json({
        usuario,
    })
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete

}


//Anotaciones Viejas para limpiar el codigo


    //Borrar fisicamente de la DB
    //const usuario = await Usuario.findByIdAndDelete(id); 