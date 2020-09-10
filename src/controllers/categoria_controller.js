const Categoria = require('../models/categoria'); // -> modelo de los perfiles para el include y el update
const categoriaCtrl = {}; // Objeto vacio
//DB connection
const pool = require('../database');// librerias para la conexion a la base de datos
//const {isLoggedIn} = require('../lib/auth');

categoriaCtrl.getCategoria = async (req,res)=> { // obtiene todo los perfiles
   try {
    const Categorias = await pool.query('SELECT * FROM categoria');
    res.json({categorias:Categorias});
   } catch (err) {  
       console.log(err); 
   }  
}

categoriaCtrl.createCategoria = async (req,res)=> {
    const {categoria} = req.body; // -> recibiendo la data del formulario
    Categoria.categoria=categoria;
    try{
        await pool.query("INSERT INTO categoria(categoria) VALUES('"+Categoria.categoria+"')");
        res.json('Se incluyo una nueva categoria')
    }catch(err){
        console.log("El error es: ",err);
    }
};
//Consultar un perfil
categoriaCtrl.getCategoriawithID= async (req,res)=>{
    const {idCategoria} = req.body;
    const idCategory = Categoria.idCategoria= idCategoria;
    try {
        const categoria = await pool.query('SELECT * from categoria WHERE idCategoria=?',[idCategory]);
        res.json(categoria);
   } catch (err) {  
       console.log(err); 
   }  
}
// eliminar
categoriaCtrl.deleteCategoria = async (req,res)=> {
    const {idCategoria} = req.body;
    const idCategory = Categoria.idCategoria = idCategoria;
    try{
        await pool.query('DELETE FROM categoria WHERE idCategoria=?', [idCategory]);
        res.json('Categoria eliminada')
    }catch(err){
        console.log("El error es: ", err)
    }  
};

//update
categoriaCtrl.updateCategoria = async (req,res)=> {
    const {categoria,idCategoria} = req.body;
    const idCategory= Categoria.idCategoria=idCategoria;
    Categoria.categoria=categoria;
    //res.json('Perfil Modificado')
    try{
        await pool.query('UPDATE categoria SET categoria=? WHERE idCategoria=?', [Categoria, idCategory]);
        res.json('Categoria Actualizada')
    }catch(err){
        console.log("El error es: ", err)
    } 
};

module.exports = categoriaCtrl;