const {response} = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require('../models/usuario.modelo');
const { generarJWT } = require("../helpers/generarjwt");

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {
        
        //Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario) {
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - correo'
        });
        }

        //Verificar si el usuario esta activo 
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
            }

        //Verificar la contraseña
            const validPassword = bcrypt.compareSync(password, usuario.password);
            if (!validPassword) {
                return res.status(400).json({
                    msg: 'Usuario / Password no son correctos - contraseña'
                });
            }

        //Generar el JWT

        const token = await generarJWT(usuario.id); 

        res.json({
           usuario,
           token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Algo salio mal, habla con el administrador"
        });
    }



}

module.exports = {
    login
}