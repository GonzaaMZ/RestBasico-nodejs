const mongoose = require('mongoose');

const dbConnection = async () => {

/*
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
*/

    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Conexión exitosa');

    } catch (error) {
        console.log(error)
        throw new Error('Error en la base de datos');
    }


}


module.exports = {
    dbConnection
}