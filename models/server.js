const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

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
    }

    routes(){ 
       this.app.use(this.authPath, require('../routes/auth.route'));
       this.app.use(this.usuariosPath, require('../routes/usuario.route'));

    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }

}

module.exports = Server;