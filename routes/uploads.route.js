const {Router} = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloud } = require('../controllers/uplouds.controller');

const { coleccionesPermitidas } = require('../helpers');

const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);


router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'ID no válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
], actualizarImagenCloud ) 
//actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
], mostrarImagen)


module.exports = router;

