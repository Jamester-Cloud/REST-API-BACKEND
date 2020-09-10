const mysql = require ('mysql');
const  {promisify}  = require('util');
//const { database } = ('./keys');-> comentar
const pool = mysql.createPool({
    host: process.env.SERV,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    acquireTimeout: process.env.TIME_OUT,
    multipleStatements: process.env.MULTIPLE_SQL,
});

pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONECTION_LOST '){ // cuando se pierde la conexion con la base de datos
            console.err("La Conexion con la base de datos fue cerrada");
        }
        if(err.code === 'ER_COUNT_ERROR'){ // cuando hay muchas conexiones
            console.err("La base de datos tiene muchas conexiones");
        }
        if(err.code === 'ERCONNREFUSED'){ // conexion rechazada. Credenciales erroneas
            console.err("La conexion a la base de datos fue rechazada");
        }
    }
    if(connection) connection.release();
    console.log("Esta conectado a la base de datos");
    return;
});
//hay notificacion de errores
pool.query = promisify(pool.query);
module.exports=pool;