const {response} = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require('../models/usuario.modelo');
const { generarJWT } = require("../helpers/generarjwt");
const { googleVerify } = require("../helpers/google-verify");

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


//Control de 
const googleSignin = async (req, res = response) => {

    //Recibo de token a traves de header
    const {id_token} = req.body;

    try {
        //Parametros recibidos mediante google
        const {correo, nombre, img} = await googleVerify(id_token);

        //Busco el correo
        let usuario = await Usuario.findOne({correo});
        
        //Verificar si el usuario existe
        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'pp',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en BD tiene estado false
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id); 


        res.json({
            usuario,
            token
        });



    } catch (error) {
        return res.status(400).json({
            msg: 'Token de Google no válido'
        });
    }

}

module.exports = {
    login,
    googleSignin
}