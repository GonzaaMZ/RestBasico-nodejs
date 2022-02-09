const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaById} = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRol } = require('../middlewares/validar-roles');

const router = Router();

/*
    {{url}}/api/categorias
*/ 

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'ID no válido').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
],  obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token válido 
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre de la categoria es necesario').not().isEmpty(),
    check('id', 'ID no válido').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
], 
actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'ID no válido').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos

], borrarCategoria);



module.exports = router;