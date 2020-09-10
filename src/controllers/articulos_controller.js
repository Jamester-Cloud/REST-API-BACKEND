const articulosCtrl = {};
const articulo = require('../models/articulo');
//DB Connection
const pool = require('../database');// librerias para la conexion a la base de datos


articulosCtrl.getArt = async (req,res) => {
    try {
        const articulos = await pool.query("SELECT * FROM articulo LEFT JOIN categoria ON articulo.idCategoria=categoria.idCategoria");
        res.json(articulos);
    } catch (error) {
        console.log("Error en: " , error);
    }
    
}

articulosCtrl.addArt = async (req,res) => {
    const {idCategoria, nombre, precio, stock} = req.body; // -> recibiendo la data del formulario
    articulo.idCategoria = idCategoria;
    articulo.nombre = nombre;
    articulo.precio = precio;
    articulo.stock  = stock;
    try {
     await pool.query("INSERT INTO articulo(idCategoria,nombre,precio, stock) VALUES("+articulo.idCategoria+",'"+articulo.nombre+"',"+articulo.precio+", "+articulo.stock+")")
     ///Fin de la consulta
     res.send('Articulo Guardado');
    } catch (err) {
        console.log('El error es: ', err);
    }
}

articulosCtrl.updateArt = async (req,res)=> {
    const {idArticulo, idCategoria, nombre, precio, stock} = req.body;
    const idArt= articulo.idArticulo=idArticulo;
    articulo.idCategoria = idCategoria;
    articulo.nombre = nombre;
    articulo.precio = precio;
    articulo.stock  = stock;
    try {
        await pool.query('UPDATE articulo SET ? WHERE idArticulo=?',[articulo, idArt]);
        res.json({articulos:'Articulo Modificado'})
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