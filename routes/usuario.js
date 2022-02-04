const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioById } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(), //Validacion si es un ID mongo
    check('id').custom( existeUsuarioById ),//Validacion si existe el usuario por el id
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo').custom( emailExiste ).isEmail(),
    check('password', 'El password es obligatorio y debe contar con mas de 6 caracteres').isLength({min: 6}),
    check('rol').custom( esRolValido ),
    validarCampos
] ,usuariosPost);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(), //Validacion si es un ID mongo
    check('id').custom( existeUsuarioById ),//Validacion si existe el usuario por el id
    validarCampos
],usuariosDelete);



module.exports = router;




//Anotaciones viejas

// check('correo', 'El correo no es válido').isEmail(),
//check('rol', 'No es un rol permitido').isIn(['ADMIN_ROL', 'USER_ROL']),