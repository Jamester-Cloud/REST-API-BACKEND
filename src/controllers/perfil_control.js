const Perfil = require('../models/perfil'); // -> modelo de los perfiles para el include y el update
const perfilCtrl = {}; // Objeto vacio
//DB connection
const pool = require('../database');// librerias para la conexion a la base de datos
//const {isLoggedIn} = require('../lib/auth');

perfilCtrl.getPerfiles = async (req,res)=> { // obtiene todo los perfiles
   try {
    const perfiles = await pool.query('SELECT * from perfil');
    res.json(perfiles);
   } catch (err) {  
       console.log(err); 
   }  
}

perfilCtrl.createPerfil = async (req,res)=> {
    const {perfil} = req.body; // -> recibiendo la data del formulario
    Perfil.perfil=perfil;
    try{
        await pool.query("INSERT INTO perfil(perfil) VALUES('"+Perfil.perfil+"')");
        res.json('Se incluyo un nuevo perfil')
    }catch(err){
        console.log("El error es: ",err);
    }
};
//Consultar un perfil
perfilCtrl.getPerfil= async (req,res)=>{
    const {idPerfil} = req.body;
    const idProfile = Perfil.idPerfil = idPerfil;
    try {
        const perfil = await pool.query('SELECT * from perfil WHERE idPerfil=?',[idProfile]);
        res.json(perfil);
   } catch (err) {  
       console.log(err); 
   }  
}
// eliminar
perfilCtrl.deletePerfil = async (req,res)=> {
    const {idPerfil} = req.body;
    const idProfile = Perfil.idPerfil = idPerfil;
    try{
        await pool.query('DELETE FROM perfil WHERE idPerfil=?', [idProfile]);
        res.json('perfil eliminado')
    }catch(err){
        console.log("El error es: ", err)
    }  
};

//update
perfilCtrl.updatePerfil = async (req,res)=> {
    const {perfil,idPerfil} = req.body;
    const idPerfilNew = Perfil.idPerfil=idPerfil;
    Perfil.perfil=perfil;
    //res.json('Perfil Modificado')
    try{
        await pool.query('UPDATE perfil SET perfil=? WHERE idPerfil=?', [Perfil.perfil, idPerfilNew]);
        res.json('perfil Actualizado')
    }catch(err){
        console.log("El error es: ", err)
    } 
};

module.exports = perfilCtrl;

