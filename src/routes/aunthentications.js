//Modulo de express-framework node.js
const express=require('express');
//enrutador
const router = express.Router();
// modulo de passport
const passport = require('passport');
//Archivo que permite las consultas a la base de datos mysql
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

router.get('/logout',(req,res)=>{
    req.logOut(); // cierre de sesion
    res.sendStatus(200);
})


module.exports=router;