const lista_articulos = require('../models/lista_articulos'); // -> modelo de los perfiles para el include y el update
const pedido = require('../models/pedido');
const factura = require('../models/factura');
//function object
const lista_articulosArt = {}; // Objeto vacio
//DB connection
const pool = require('../database');// librerias para la conexion a la base de datos


//add to Cart function
lista_articulosArt.addToCart = async (req,res)=> {
    const {idArticulo, idCliente, cantidad, stock} = req.body; // -> recibiendo la data del formulario
    //Asignacion de valores
   const articulo =  lista_articulos.idArticulo=idArticulo;
   const cliente = lista_articulos.idCliente=idCliente;
   const cantidadArticulo = lista_articulos.cantidad=cantidad;
   const stockArticulo = stock;
   //resta del stock del articulo y la cantidad requerida por el cliente
   const articulosRestantes= stockArticulo - cantidadArticulo;  
   //console.log("el id del articulo es:", articulo, " el id del cliente es: ", cliente, " la cantidad del Articulo es: ", cantidadArticulo, "la resta de los articulos es: ", articulosRestantes)
   // empieza la transaccion
   try {
        await pool.query("START TRANSACTION")
        //restando cantidad de stock al articulo
        await pool.query("UPDATE articulo SET stock=? WHERE idArticulo=?",[articulosRestantes, articulo]);
        //Insertando en la lista   
        await pool.query("INSERT INTO lista_articulos(idArticulo, idCliente, cantidad ) VALUES('"+articulo+"','"+cliente+"','"+cantidadArticulo+"')");

        await pool.query("COMMIT");

        res.sendStatus(200);
    } catch (err) {
        await pool.query("ROLLBACK");
   }
};

//Consultar la lista de articulos
lista_articulosArt.getCart= async (req,res)=>{
    const {idCliente} = req.body;
    const idClient = lista_articulos.idCliente= idCliente;
    try {
        const cart = await pool.query('SELECT * FROM lista_articulos JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo JOIN categoria ON categoria.idCategoria=articulo.idCategoria WHERE lista_articulos.idCliente=?',[idClient]);
        
        res.json(cart);
   } catch (err) {  
       console.log(err); 
   }  
}
// Devolver articulo
lista_articulosArt.devolver = async (req,res)=> {
    const {idListaArticulos} = req.body;
    const idLista = lista_articulos.idListaArticulos = idListaArticulos;
    /// Consultando la cantidad del articulo a devolver en la lista
    try{
        const articulo =  await pool.query("SELECT cantidad, stock, articulo.idArticulo FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo WHERE idListaArticulos=?", [idLista]);
        //Cantidad a devolver
        let cantidad =  articulo[0].cantidad
        //Stock actual del articulo
        let stockActual = articulo[0].stock
        //Sumando la cantidad al stock
        let devolucion  = stockActual + cantidad
        //empezando la transaccion
        await pool.query("START TRANSACTION")
        //Actualizando el articulo
        await pool.query("UPDATE articulo SET stock=? WHERE idArticulo=?",[devolucion, articulo[0].idArticulo]);
        //Eliminando el articulo de la lista del cliente
        await pool.query("DELETE FROM lista_articulos WHERE idListaArticulos=?",[idLista]);
        //Commit a la transaccion
        await pool.query("COMMIT");
        //respuesta
        res.sendStatus(200);
    }catch(err){
        console.log("El error es: ", err)
        await pool.query("ROLLBACK");
    }  
};

lista_articulosArt.getOrder= async (req,res)=>{
    const {idCliente} = req.body;
    const idClient = lista_articulos.idCliente= idCliente;
    try {
        const ordersComplete = await pool.query('SELECT * FROM pedido LEFT JOIN factura ON pedido.idPedido=factura.idPedido WHERE idCliente=? AND estatusPedido=2' ,[idClient]);
        const ordersDenegate = await pool.query('SELECT * FROM pedido LEFT JOIN factura ON pedido.idPedido=factura.idPedido WHERE idCliente=? AND estatusPedido=0' ,[idClient]);
        const ordersImcomplete = await pool.query('SELECT * FROM pedido LEFT JOIN factura ON pedido.idPedido=factura.idPedido WHERE idCliente=? AND estatusPedido=1' ,[idClient]);
        res.json({completados:ordersComplete, Denegados:ordersDenegate, Imcompletos:ordersImcomplete});
   } catch (err) {  
       console.log(err); 
   }  
}

//Hacer pedido
lista_articulosArt.pay = async (req,res)=> {
    const {idCliente,descripcion,fechaEntrega,totalApagar} = req.body;
    //factura data
    const totalPagar=factura.totalApagar=totalApagar
    const idClient= factura.idCliente = idCliente
    //pedido data
    const description= pedido.descripcion= descripcion
    const fechaAEntregar= pedido.fechaEntrega = fechaEntrega

    try{
       //empezando la transaccion
       await pool.query("START TRANSACTION");
        // Ingresando en la tabla pedido
       const pedido = await pool.query("INSERT INTO pedido(descripcion, fechaEntrega) VALUES('"+description+"','"+fechaAEntregar+"')");
       //ID DEL PEDIDO
       factura.idPedido=pedido.insertId;
       //Ingresando en la tabla factura
       await pool.query("INSERT INTO factura(idPedido, idCliente, totalApagar) VALUES('"+factura.idPedido+"','"+idClient+"', '"+totalPagar+"')");
       //Limpiando lista de articulos
       await pool.query('DELETE FROM lista_articulos WHERE idCliente=?',[idClient]);
       //Finalizando la transaccion
       await pool.query("COMMIT");
       //Mandando respuesta al servidor
       res.sendStatus(200);

    }catch(err){
        await pool.query("ROLLBACK");
        console.log("El error es: ", err)
    } 
};



lista_articulosArt.denyOrder= async (req,res)=>{
    const {idPedido} = req.body;

    // Denegando el pedido
    await pool.query("UPDATE pedido SET estatusPedido=0 WHERE idPedido=?", [idPedido]);

    res.sendStatus(200);
}


lista_articulosArt.alterarPedido= async (req,res)=>{
    const {idPedido} = req.body;

    //Consultando el pedido para saber el estatus y luego cambiarlo segun se necesite
    const estatusPedido= await pool.query("SELECT estatusPedido FROM pedido WHERE idPedido=?", [idPedido]);
    // Numero del estatus del pedido
    const numberPedido = estatusPedido[0].estatusPedido
    //Condicion que aplicara en caso de ser 1 o 2 etc
    switch (numberPedido) {
        case '1':
            //Si esta imcompleto. Cambiar a completo
            await pool.query("UPDATE pedido SET estatusPedido=2 WHERE idPedido=?", [idPedido]);
            res.json("Pedido completado");
            break;
    
        case '2':
            // Si esta completo. Cambiar a imcompleto y agregar a revision de pedidos
            await pool.query("UPDATE pedido SET estatusPedido=1 WHERE idPedido=?", [idPedido]);
            res.json("Pedido agregado a revision");
            break;

        case '0':
            // si esta denegado. Eliminarlo de la base de datos
            await pool.query("DELETE FROM pedido WHERE idPedido=?", [idPedido]);
            res.json("Pedido eliminado");
            break;
    }
}


module.exports = lista_articulosArt;