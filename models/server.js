const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        //paths
        this.authPath =         '/api/auth';
        this.buscarPath =       '/api/buscar';
        this.categoriasPath =   '/api/categorias';
        this.productosPath =    '/api/productos';
        this.usuariosPath =     '/api/usuarios';
        this.uploadsPath =      '/api/uploads';


        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middleware();
        //Rutas de la aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middleware() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use( express.json())
        
        //Directorio público
        this.app.use(express.static('public'));

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes(){ 
       this.app.use(this.authPath, require('../routes/auth.route'));
       this.app.use(this.buscarPath, require('../routes/buscar.route'));
       this.app.use(this.categoriasPath, require('../routes/categorias.route'));
       this.app.use(this.productosPath, require('../routes/productos.route'));
       this.app.use(this.usuariosPath, require('../routes/usuario.route'));
       this.app.use(this.uploadsPath, require('../routes/uploads.route'));


    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }

}

module.exports = Server;