const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');
// funcion de login para la aplicacion
passport.use('local.signin', new localstrategy({
    usernameField:'username',
    passwordField:'pass',
    passReqToCallback:true
}, async (req,username,pass,done)=>{
    // consultando que el usuario y su perfil en el sistema
    const rows = await pool.query('SELECT usuario.idUsuario, username, pass, perfil, idCliente FROM usuario LEFT JOIN perfil_usuario ON perfil_usuario.idUsuario = usuario.idUsuario LEFT JOIN perfil ON perfil_usuario.idPerfil=perfil.idPerfil LEFT JOIN persona ON persona.idPersona=usuario.idPersona LEFT JOIN cliente ON cliente.idPersona=persona.idPersona WHERE usuario.username=?',[username]);
    if(rows.length > 0){ // usuario encontrado
        const user = rows[0]; // trayendo la data del usario
        const validPass = await helpers.login(pass, user.pass); // comparando contraseñas
        if(validPass){ // contraseña valida
            return done(null, user);
        }else{ // contraseña no valida
            done(null,false, console.log('Password invalida'));
        }
    }else{ // usuario no encontrado
        return done(null, false, console.log('Usuario no encontrado'));
    }

}));

//Funcion para el registro de usuario
passport.use('local.signup', new localstrategy({
    usernameField:'username',
    passwordField:'pass',
    passReqToCallback:true
}, async (req,username,pass, done)=>{
    // Datos persona provenientes del formulario
    const {nombrePersona, apellidoPersona, correoPersona} = req.body;

    // objeto con los datos persona
    const newPersona={
        nombrePersona,
        apellidoPersona,
        correoPersona
    };
    
    try {//
        await pool.query("START TRANSACTION");
        
        const perfiles =await pool.query('SELECT * FROM perfil');

        if(perfiles.length === 0){
            await pool.query("INSERT INTO perfil(perfil) VALUES('Administrador')");
            
            await pool.query("INSERT INTO perfil(perfil) VALUES('Cliente')");
        }

        
        // operacion de insercion (Tabla persona)
        const lastidPersona = await pool.query('INSERT INTO persona SET ?',[newPersona]);
        // creamos el objeto nuevoUsuario
        const newUser={
            idPersona:0,
            username,
            pass,
        };
        // se asigna a la propiedad de idPersona el nuevo id proveniente de la recien insercion
        newUser.idPersona= lastidPersona.insertId; 
        newUser.pass = await helpers.encryptPasswords(pass); // encripta la contraseña
        //insertando los datos en la tabla usuario
        const resultado = await pool.query("INSERT INTO usuario SET ?" , [newUser]);
        //obtneniendo los datos del perfil cliente
        const perfilCliente = await pool.query('SELECT idPerfil FROM perfil WHERE perfil=?',["Cliente"]);
        //creando el objeto con los ids que iran en la tabla perfil_usuario
        perfilNewUser={
            idUsuario:0,
            idPerfil:0
        };
        //asignacion de valores al objeto
        perfilNewUser.idUsuario=resultado.insertId;
        perfilNewUser.idPerfil=perfilCliente[0].idPerfil;
        //insertando  el id del usuario y del perfil en la DB
        await pool.query('INSERT INTO perfil_usuario SET ?', [perfilNewUser]);
        //creacion del objeto cliente
        newCliente={
            idPersona:0,
            descuento:0
        }
        //asignacion de valores al objeto
        newCliente.idPersona=lastidPersona.insertId;
        //Insertando en la tabla cliente
        await pool.query('INSERT INTO cliente SET ?', [newCliente]);
        //Retornando el id de usuario para la consulta de datos en la session
        newUser.id=resultado.insertId;

        const rows = await pool.query('SELECT usuario.idUsuario, username, pass, perfil, idCliente FROM usuario LEFT JOIN perfil_usuario ON perfil_usuario.idUsuario = usuario.idUsuario LEFT JOIN perfil ON perfil_usuario.idPerfil=perfil.idPerfil LEFT JOIN persona ON persona.idPersona=usuario.idPersona LEFT JOIN cliente ON cliente.idPersona=persona.idPersona WHERE usuario.username=?',[newUser.username]);
        user=rows[0];
        await pool.query("COMMIT");
        // retornando la informacion del usuario para su serializacion en la base de datos
        return done(null, user);
    } catch (error) {
        console.log(error);
        await pool.query("ROLLBACK");
    }

}));

passport.serializeUser((user, done)=> { // funcion que actua al inicio y registro de un nuevo usuario
    done(null, user.idUsuario); 
    done(null, user.id); 
});
  
passport.deserializeUser(async (id, done) =>{ // Data de la session. Se ejecuta por cada ruta visitada por el usuario
      const rows = await pool.query('SELECT * FROM usuario LEFT JOIN persona ON persona.idPersona=usuario.idPersona LEFT JOIN cliente ON cliente.idPersona=persona.idPersona LEFT JOIN perfil_usuario ON perfil_usuario.idUsuario=usuario.idUsuario LEFT JOIN perfil ON perfil_usuario.idPerfil=perfil.idPerfil WHERE usuario.idUsuario = ?',[id])
      done(null, rows[0]);
});