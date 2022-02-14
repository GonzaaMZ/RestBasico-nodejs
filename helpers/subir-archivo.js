const path = require("path");
const { v4: uuidv4 } = require('uuid');


//Anotacion: recibo la request y las extensiones por los parametros
const subirArchivo = (files, extensionPermitidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
 
    return new Promise ((resolve, reject) => {
    //Guardo el archivo 
    const { archivo } = files;
        
    //Extraigo la extension del archivo
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];
    
    //Valido la extension
    if (!extensionPermitidas.includes(extension)) {
        return reject(`La extensión ${extension} no está permitida, ${extensionPermitidas}`)
    }
    
    //Le doy un nombre unico al archivo con uuid 
    const nombreUnico = uuidv4() + '.' + extension;
    
    //Declaro la ruta donde se va a guardar el archivo
    const uploadPath = path.join(__dirname , '../uploads/', carpeta , nombreUnico);
    
    //Lo muevo hacia esa ruta
    archivo.mv(uploadPath, (err) => {
        if (err) {
        reject(err);
        }
    
        //Resolve y respuesta de la promesa
        resolve(nombreUnico)
    });

    })
}



module.exports = {
    subirArchivo
}