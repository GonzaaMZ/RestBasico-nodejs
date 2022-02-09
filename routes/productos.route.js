const {Router} = require('express');
const { check } = require('express-validator');
const req = require('express/lib/request');

const { crearProducto,obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');


const { productoExiste, existeProductoById, existeCategoriaById } = require('../helpers/db-validators');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRol } = require('../middlewares/validar-roles');

const router = Router();

/*
    {{url}}/api/productos
*/ 

//Obtener todas los productos - publico
router.get('/', obtenerProductos);

//Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
],obtenerProducto);

//Crear producto - privado - cualquier persona con un token válido 
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], crearProducto);

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    //check('id', 'ID no válido').isMongoId(),
    check('id').custom( existeProductoById ),
    validarCampos
],actualizarProducto);

//Borrar un producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'ID no válido').isMongoId(),
    check('id').custom( existeProductoById ),
    validarCampos
],borrarProducto);



module.exports = router;