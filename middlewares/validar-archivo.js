const { response } = require("express");


const validarArchivoSubir = (req, res = response, next) => {

    //Verifico si en la request viene algun archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivo'
        });
    }

    next();
}


module.exports = {
    validarArchivoSubir
}