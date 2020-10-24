// Declaracion del objeto que va a contener los metodos para comunicacion hacia la base de datos
const articulosCtrl = {};
// declaracion del modelo
const articulo = require('../models/articulo');
//DB Connection
const pool = require('../database');// librerias para la conexion a la base de datos
//Formidable for image manipulation
const formidable = require('formidable');
//File system module
var fs = require('fs');

articulosCtrl.getArt = async (req,res) => {
    try {
        const articulos = await pool.query("SELECT * FROM articulo LEFT JOIN categoria ON articulo.idCategoria=categoria.idCategoria");
        res.json(articulos);
    } catch (error) {
        console.log("Error en: " , error);
    }
    
}
// metodo para agregar un articulo
articulosCtrl.addArt =(req,res) => {
    const form = formidable({ multiples: true }); // -> recibiendo la data del formulario
    form.parse(req, async (err, fields, files) => { // recibiendo el formulario multipart/Data
        if (err) { /// condicion de error
          next(err); // continuar
          return;
        }
        // manipulating de data
        try{
            
            // ruta vieja
            var oldpath = String(files.image.path);
            // nueva ruta (Cambiar en hosting) 
            var newpath = 'C:/Users/Jamester/Documents/React-Bakery/front-end/public/img/articles/' + String(files.image.name);
            
            // Cambiando de posicion la imagen al carpeta en el servidor
            fs.rename(oldpath, newpath, function (err) { // moviendo a la ruta de
                if (err){
                    throw err;
                }
            });

            // Insertando articulos
            await pool.query("INSERT INTO articulo (idCategoria, nombre, descripcion, precio, stock, imagenArticulo) VALUES("+fields.idCategoria+", '"+fields.nombre+"', '"+fields.descripcion+"', "+fields.precio+", "+fields.stock+", '"+newpath+"')");
            // Respuesta al servidor

            res.json({fields});
            
        } catch(err){
            console.log(err);
        }
    });

}

articulosCtrl.updateArt = async (req,res)=> {
    const form = formidable({ multiples: true });
    
        try {
            form.parse(req, async (err, fields, files) => { // recibiendo el formulario multipart/Data
            if (err) { /// condicion de error
              next(err); // continuar
              return;
            }
            const idArt= articulo.idArticulo=fields.idArticulo;
            articulo.idCategoria = fields.idCategoria;
            articulo.nombre = fields.nombre;
            articulo.descripcion = fields.descripcion
            articulo.precio = fields.precio;
            articulo.stock  = fields.stock;
        // manipulating de data
            // ruta vieja
            var oldpath = String(files.image.path);
            // nueva ruta (Cambiar en hosting) 
            var newpath = 'C:/Users/Jamester/Documents/React-Bakery/front-end/public/img/articles/' + String(files.image.name);
            
            // Cambiando de posicion la imagen al carpeta en el servidor
            fs.rename(oldpath, newpath, function (err) { // moviendo a la ruta de
                if (err){
                    throw err;
                }
            });
            // cambiando la imagen
            articulo.imagenArticulo = newpath;

            // modificando articulo
           await pool.query("UPDATE articulo SET ? WHERE idArticulo=?",[articulo, idArt]); 
           // Respuesta al servidor
            res.sendStatus(200);
            
            });
    } catch (err) {
        console.log("error en: ",err)
    }
    
}

articulosCtrl.deleteArt = async (req,res)=> {
    const {idArticulo} = req.body;
    try {
        const idArt =articulo.idArticulo=idArticulo;
        await pool.query('DELETE FROM articulo WHERE idArticulo=?',[idArt]);
        res.json('Articulo Eliminado');
    } catch (err) {
        console.log("el erro es: ", err)
    }
}


articulosCtrl.getArtWithId= async (req,res)=>{
    const {idArticulo} = req.body;
    try {
        const idArt = articulo.idArticulo = idArticulo;
        const art = await pool.query('SELECT * from articulo LEFT JOIN categoria ON categoria.idCategoria=articulo.idCategoria WHERE idArticulo=?',[idArt]);
        res.json(art);
   } catch (err) {  
       console.log(err); 
   }  
}
module.exports = articulosCtrl;