const usuariosArt = {};
const Usuarios = require('../models/usuarios');
//Database connection
const pool = require('../database');


usuariosArt.getUsuarios = async (req,res) => {
    try {
        const usuarios = await pool.query("SELECT * FROM usuario LEFT JOIN persona ON persona.idPersona=usuario.idPersona");
        res.json(usuarios);
    } catch (error) {
        console.log("Error en: " , error);
    }
    
}

usuariosArt.updateUser = async (req,res)=> {
    //Data from form
    const {idUsuario, username, nombrePersona, apellidoPersona, correoPersona} = req.body;
    // Usuario
    const idUser = Usuarios.idUsuario=idUsuario;
    const Username =Usuarios.username=username;
    //Person data
    const PersonName =Usuarios.nombrePersona=nombrePersona;
    const PersonLastName =Usuarios.apellidoPersona=apellidoPersona;
    const correoElectronico =Usuarios.correoPersona=correoPersona;
    try {
        await pool.query('UPDATE usuario \
            LEFT JOIN persona ON persona.idPersona=usuario.idPersona \
            SET usuario.username = ?,persona.nombrePersona = ?, persona.apellidoPersona = ?, persona.correoPersona = ? \
            WHERE usuario.idUsuario = ?',
            [Username, PersonName, PersonLastName, correoElectronico, idUser]);
        res.sendStatus(200);
    } catch (err) {
        console.log("error en: ",err);
    }
    
}

usuariosArt.blockUsers = async (req,res)=>{
    const {idUsuario} = req.body
    const idUser = Usuarios.idUsuario = idUsuario;
    try { 
       await pool.query('UPDATE usuario SET estatusUsuario=0 WHERE idUsuario = ?', [idUser]);
        res.send(200); // Request OK response 200
    } catch (err) {
        console.log("Error en ", err)
    }
}


usuariosArt.AdminDashboard = async(req,res)=>{
    const {username} = req.body
    console.log(username);
    try { 
       const User = await pool.query('SELECT * FROM usuario LEFT JOIN perfil_usuario ON perfil_usuario.idUsuario=usuario.idUsuario LEFT JOIN perfil ON perfil.idPerfil=perfil_usuario.idPerfil WHERE username=?', [username]);

       if(User[0].perfil == "Administrador" ){ // Dashboard Administrador
           try {
            // Consulta de datos Globales
            const articulos = await pool.query('SELECT * FROM articulo LEFT JOIN categoria ON categoria.idCategoria=articulo.idCategoria');
            // clientes activos e inactivos
            const clientesActivos = await pool.query('SELECT COUNT(*) AS clientesActivos FROM cliente WHERE estatusCliente=1');
            const clientesInactivos = await pool.query('SELECT COUNT(*) AS clientesInactivos FROM cliente WHERE estatusCliente=0');
            //Pedidos Completados e incompletos;
            const pedidosCompletados= await pool.query('SELECT COUNT(*) AS pedidosComplete FROM pedido WHERE estatusPedido=2');
            const pedidosImcompletados= await pool.query('SELECT COUNT(*) AS pedidosIncomplete FROM pedido WHERE estatusPedido=1');
            res.json({Articulos:articulos,ActiveClients:clientesActivos,InactiveClients:clientesInactivos,Complete:pedidosCompletados,Incomplete:pedidosImcompletados});
           } catch (err) {
            
           }
        }else{ // Dashboard Cliente

        }
    } catch (err) {
        console.log("Error en ", err)
    }
}

usuariosArt.activeUser = async (req,res)=>{
    const {idUsuario} = req.body
    console.log(idUsuario);
    const idUser = Usuarios.idUsuario = idUsuario;
    try { 
       await pool.query('UPDATE usuario SET estatusUsuario=1 WHERE idUsuario = ?', [idUser]);
        res.send(200); // Request OK response 200
    } catch (err) {
        console.log("Error en ", err)
    }
}

usuariosArt.getUser = async (req,res)=>{
    const {idUsuario} = req.body
    const idUser = Usuarios.idUsuario=idUsuario;
    try {
      const User = await pool.query('SELECT * FROM usuario LEFT JOIN persona ON persona.idPersona=usuario.idPersona WHERE idUsuario = ?', [idUser]);
        res.json(User); // Request OK response userData
    } catch (err) {
        console.log("Error en ", err)
    }
}

module.exports = usuariosArt;