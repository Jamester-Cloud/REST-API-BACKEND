//Modulo de express-framework node.js
const express=require('express');
//enrutador
const router = express.Router();
// modulo de passport
const passport = require('passport');
//Archivo que permite las consultas a la base de datos mysql
const pool = require('../database');
//Librerias de autenticacion en passport con islogged and isnotlogged
const {isLoggedIn, isNotloggedIn} = require('../lib/auth');
////////////////////////////////////////////////////////// Funciones por cada ruta
router.post('/signup', isNotloggedIn, passport.authenticate('local.signup', {session:false}),
    (req,res)=>{
        res.json([{ idUsuario: req.user.idUsuario, username: req.user.username, perfil:req.user.perfil, idCliente:req.user.idCliente}]);
}); // metodo de registro de un usuario

//Metodo de inicio de session
router.post('/signin',
  passport.authenticate('local.signin', { session: false }),
  (req, res)=> {
    res.json([{ idUsuario: req.user.idUsuario, username: req.user.username, perfil:req.user.perfil, idCliente:req.user.idCliente}]);
});

router.get('/profile', isLoggedIn, async (req,res)=>{
    if(req.user.perfil=='Administrador'){ // dashboard administrador
                
        const articulos = await pool.query('SELECT * FROM articulo LEFT JOIN categoria ON categoria.idCategoria=articulo.idCategoria');
        // clientes activos e inactivos
        const clientesActivos = await pool.query('SELECT COUNT(*) AS clientesActivos FROM cliente WHERE estatusCliente=1');
        const clientesInactivos = await pool.query('SELECT COUNT(*) AS clientesInactivos FROM cliente WHERE estatusCliente=0');
        //Pedidos Completados e incompletos;
        const pedidosCompletados= await pool.query('SELECT COUNT(*) AS pedidosComplete FROM pedido_cliente WHERE estatusPedidoCliente=2');
        const pedidosImcompletados= await pool.query('SELECT COUNT(*) AS pedidosIncomplete FROM pedido_cliente WHERE estatusPedidoCliente=1');
        // renderizado de la vista con la informacion consultada
        res.render('profile',{articulos:articulos,clientesActivos:clientesActivos[0],clientesInactivos:clientesInactivos[0],pedidosCompletados:pedidosCompletados[0],pedidosImcompletados:pedidosImcompletados[0]});
    }else{ // dashboard cliente
        //Pedidos Completados
        const pedidosCompletados= await pool.query('SELECT COUNT(*) AS pedidosComplete FROM pedido_cliente WHERE estatusPedidoCliente=2 AND idCliente=?', [req.user.idCliente]);
        //imcompletos
        const pedidosImcompletados= await pool.query('SELECT COUNT(*) AS pedidosIncomplete FROM pedido_cliente WHERE estatusPedidoCliente=1 AND idCliente=?', [req.user.idCliente]);
        //Anulados
        const pedidosAnulados= await pool.query('SELECT COUNT(*) AS pedidoAnulado FROM pedido_cliente WHERE estatusPedidoCliente=0 AND idCliente=?', [req.user.idCliente]);
        // Carrito de compras
        const listArtiFilter = await pool.query('SELECT * FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo LEFT JOIN categoria ON articulo.idCategoria=categoria.idCategoria WHERE lista_articulos.idCliente=? AND lista_articulos.estatusListaArticulos=1',[req.user.idCliente]);
        //render de la vista
        res.render('clientProfile',{pedidosCompletados:pedidosCompletados[0],pedidosImcompletados:pedidosImcompletados[0],pedidosAnulados:pedidosAnulados[0],listArtiFilter:listArtiFilter});
    }

})
router.get('/logout',(req,res)=>{
    req.logOut(); // cierre de sesion
    res.sendStatus(200);
})


module.exports=router;