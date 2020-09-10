const clientesArt = {};
const clientes = require('../models/clientes');
//DB Connection
const pool = require('../database');// librerias para la conexion a la base de datos


clientesArt.getClients = async (req,res) => {
    try {
        const clientes = await pool.query("SELECT * FROM cliente LEFT JOIN persona ON persona.idPersona=cliente.idPersona");
        res.json(clientes);
    } catch (error) {
        console.log("Error en: " , error);
    }
    
}

clientesArt.addClient = async (req,res) => {
    const {idPersona, descuento} = req.body; // -> recibiendo la data del formulario
    clientes.idPersona=idPersona;
    clientes.descuento=descuento;
    try {
        await pool.query("INSERT INTO cliente(idPersona,descuento) VALUES("+clientes.idPersona+", "+clientes.descuento+")");
        ///Fin de la consulta
        res.send('Cliente Guardado');
    } catch (err) {
        console.log('El error es: ', err);
    }
}

clientesArt.updateClient = async (req,res)=> {
    const {idCliente, idPersona, descuento} = req.body;
    const idClient= clientes.idCliente=idCliente;

    clientes.idPersona = idPersona;
    clientes.descuento = descuento;

    try {
        await pool.query('UPDATE cliente SET ? WHERE idCliente=?',[clientes, idClient]);
        res.json('Cliente Modificado');
    } catch (err) {
        console.log("error en: ",err);
    }
    
}

clientesArt.deleteClient = async (req,res)=> {
    const {idCliente} = req.body;
    try {
        const idClient =clientes.idClientes=idCliente;
        await pool.query('UPDATE cliente SET estatusCliente=0 WHERE idCliente=?',[idClient]);
        res.json('Articulo Eliminado');
    } catch (err) {
        console.log("el erro es: ", err)
    }
}


clientesArt.getClientWithId= async (req,res)=>{
    const {idCliente} = req.body;
    try {
        const idClient = clientes.idCliente = idCliente;
        const cliente = await pool.query('SELECT * from cliente LEFT JOIN persona ON persona.idPersona=cliente.idPersona WHERE cliente.idCliente=?',[idClient]);
        res.json(cliente);
   } catch (err) {  
       console.log(err); 
   }  
}
module.exports = clientesArt;