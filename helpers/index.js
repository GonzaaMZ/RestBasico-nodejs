

const dbValidators  = require('./db-validators');
const generarJWT    = require('./generarjwt');
const googleVerify  = require('./google-verify');
const subirArchivo  = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...dbValidators,
    ...subirArchivo

}