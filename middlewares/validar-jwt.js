const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.modelo');

const validarJWT =  async (req = request, res = response, next) => {

    //Recibimos el token mediante el header de la petición
    const token = req.header('x-token');
  
    //Verificamos que el token no venga vacio
  if (!token){
      return res.status(401).json({
        msg: 'No hay token en la petición'
      });
  }
  
  try {
      //Comprobamos si es un JWT válido
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    
    //Leer el usuario que corresponde al ID
    const usuario = await Usuario.findById(uid);

    //Validamos que el usuario exista en la BD
    if (!usuario) {
        return res.status(401).json({
            msg: 'Token no válido - usuario no existe en DB'
        });
    }
    
    //Verificar si el ID tiene estado true
    if(!usuario.estado){
        return res.status(401).json({
            msg: 'Token no válido - usuario con estado: false'
        });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
        msg: 'Token no válido'
    })      
  }

}

module.exports = {
    validarJWT
}
