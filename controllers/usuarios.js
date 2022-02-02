const { response } = require('express');

const usuariosGet = (req, res = response) => {
    const {q, nombre = "no name", apikey} = req.query;
    
    res.json({
        msj: 'get API-Controller',
        q,
        nombre,
        apikey
    })
}

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body;
    res.json({
        msj: 'post API-Controller',
        nombre,
        edad
    })
}

const usuariosPut = (req, res) => {

    const id = req.params.id;
    res.json({
        msj: 'put API-Controller',
        id
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msj: 'delete API-Controller'
    })
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete

}