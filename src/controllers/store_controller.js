const lista_articulos = require('../models/lista_articulos'); // -> modelo de las listas de articulos
const pedido = require('../models/pedido');    //  modelo de los pedidos
const Factura = require('../models/factura');  // modelo de las facturas
const Ticket = require('../models/Ticket'); // modelo de los tickets a soporte

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
        await pool.query("START TRANSACTION")
        
        const articulo =  await pool.query("SELECT * FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo WHERE idListaArticulos=?", [idLista]);
        //id del articulo a devolver
        let idArticulo = articulo[0].idArticulo;
        //Cantidad a devolver
        let cantidad =  articulo[0].cantidad
        //Stock actual del articulo
        let stockActual = articulo[0].stock
        //Sumando la cantidad al stock
        let devolucion  = stockActual + cantidad
        //--//
        //empezando la transaccion
        
        //Actualizando el articulo
        await pool.query("UPDATE articulo SET stock=? WHERE idArticulo=?",[devolucion, idArticulo]);
        //Eliminando el articulo de la lista del cliente
        await pool.query("DELETE FROM lista_articulos WHERE idListaArticulos=?",[idLista]);
        //Commit a la transaccion
        await pool.query("COMMIT");
        //respuesta
        res.sendStatus(200);
    }catch(err){
        await pool.query("ROLLBACK");
        console.log("El error es: ", err)
        
    }  
};

lista_articulosArt.getOrder = async (req,res)=>{
    const {idCliente} = req.body;
    const idClient = lista_articulos.idCliente= idCliente;
    try {
        const ordersComplete = await pool.query('SELECT * FROM factura LEFT JOIN pedido ON pedido.idPedido=factura.idPedido WHERE idCliente=? AND estatusPedidoCliente=2' ,[idClient]);
        const ordersDenegate = await pool.query('SELECT * FROM factura LEFT JOIN pedido ON pedido.idPedido=factura.idPedido WHERE idCliente=? AND estatusPedidoCliente=0' ,[idClient]);
        const ordersImcomplete = await pool.query('SELECT * FROM factura LEFT JOIN pedido ON pedido.idPedido=factura.idPedido WHERE factura.idCliente=? AND estatusPedidoCliente=1' ,[idClient]);
        res.json({completados:ordersComplete, Denegados:ordersDenegate, Imcompletos:ordersImcomplete});
    } catch (err) {  
       console.log(err); 
    }  
}

lista_articulosArt.completeTicket=async (req,res)=>{
    const {idCliente, feedback} = req.body;
    let idClientes = Factura.idCliente = idCliente; 
    let feed = feedback;
    try {
        //Empezando la transaccion
        await pool.query('START TRANSACTION');

        console.log("LLego", req.body);
        // Actualizando el ticket a completado
        await pool.query("UPDATE ticket_soporte \
            LEFT JOIN factura ON factura.idFactura = ticket_soporte.idFactura \
            LEFT JOIN cliente ON factura.idCliente=cliente.idCliente \
            SET estatusTicket=2\
            WHERE factura.idCliente=?", [idClientes]
        )
        // Agregando el feedback
        await pool.query("INSERT INTO feedback (idCliente, feedback) VALUES('"+idClientes+"', '"+feed+"')");
        //terminando la transaccion
        await pool.query('COMMIT');
        // enviando el estado
        res.sendStatus(200);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log(error)
    }
}

lista_articulosArt.supportTicket= async(req,res)=>{

    const {idFactura, tituloTicketSoporte, descripcionTicketSoporte, causaTicketSoporte} = req.body;

    let idFacturas = Factura.idFactura = idFactura
    let titulo = Ticket.tituloTicketSoporte = tituloTicketSoporte
    let descripcion = Ticket.descripcionSoporte = descripcionTicketSoporte
    let causaTicketSoportes = Ticket.causaTicketSoporte = causaTicketSoporte

    try {
        // iniciando transaccion
        await pool.query("START TRANSACTION");
        //Inicio de la insercicon del ticket de soporte
        await pool.query("INSERT INTO ticket_soporte (idFactura, tituloTicket, descripcionSoporte, causaTicketSoporte) VALUES('"+idFacturas+"','"+titulo+"', '"+descripcion+"', '"+causaTicketSoportes+"')");
        // actualizando la factura para que se refleje el pedido como incompleto
        await pool.query("UPDATE factura SET estatusPedidocliente=1 WHERE idFactura=?", [idFacturas])
        //commit a la transacction
        await pool.query("COMMIT");
        //Mandando respuesta al front-end
        res.sendStatus(200);
    } catch (error) {
        await pool.query("ROLLBACK");
        console.log(error);
    }

}

lista_articulosArt.getTicketClient= async (req,res)=>{
    const {idCliente} = req.body;
    let id =  Factura.idCliente = idCliente;
    try {
        //Consulta cada ticket perteneciente al cliente
        const ticketsCliente = await pool.query("SELECT * FROM ticket_soporte \
        LEFT JOIN factura ON factura.idFactura=ticket_soporte.idFactura\
        LEFT JOIN cliente ON cliente.idCliente=factura.idCliente\
        WHERE factura.idCliente=?", [id]);
        //Envio de la informacion al front-end
        res.json(ticketsCliente);

    } catch (error) {
        console.log(error);
    }
}


lista_articulosArt.getAllTickets= async (req,res) =>{
    
    try {
        // Traemos la data de los tickets sin concluir
        const ticketsNoCompletados = await pool.query('SELECT * FROM ticket_soporte WHERE estatusTicket=1');
        // Traemos la data de los tickets concluidos
        const ticketsCompletos = await pool.query('SELECT * FROM ticket_soporte WHERE estatusTicket=2');
        // Traemos la data de los tickets denegados
        const ticketsDenegados = await pool.query('SELECT * FROM ticket_soporte WHERE estatusTicket=0');

        res.json({completados:ticketsCompletos, Denegados:ticketsDenegados, Imcompletos:ticketsNoCompletados});
    } catch (error) {
        console.log(error);
    }

}

lista_articulosArt.deleteTicket= async(req,res)=>{

    const {idTicketSoporte} = req.body;

    try {
        // Traemos la data de los tickets sin concluir
        await pool.query('DELETE FROM ticket_soporte WHERE idTicketSoporte=?', [idTicketSoporte]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
}

lista_articulosArt.denyTicket= async(req,res)=>{
    const {idTicketSoporte} = req.body;
    try {
        // Traemos la data de los tickets sin concluir
        await pool.query('UPDATE ticket_soporte SET estatusTicket=0 WHERE idTicketSoporte=?', [idTicketSoporte]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
}


//Hacer pedido
lista_articulosArt.pay = async (req,res)=> {
    const {idCliente,descripcion,fechaEntrega,totalApagar} = req.body;
    //factura data
    const totalPagar=Factura.totalApagar=totalApagar
    const idClient= Factura.idCliente = idCliente
    //pedido data
    const description= pedido.descripcion= descripcion
    const fechaAEntregar= pedido.fechaEntrega = fechaEntrega
    // Pagando el articulo
    try{
       //empezando la transaccion
       await pool.query("START TRANSACTION");
        // Ingresando en la tabla pedido
       const pedido = await pool.query("INSERT INTO pedido(descripcion, fechaEntrega) VALUES('"+description+"','"+fechaAEntregar+"')");
       //ID DEL PEDIDO
       Factura.idPedido=pedido.insertId;
       //Ingresando en la tabla factura
       await pool.query("INSERT INTO factura(idPedido, idCliente, totalApagar) VALUES('"+Factura.idPedido+"','"+idClient+"', '"+totalPagar+"')");
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
    await pool.query("UPDATE factura SET estatusPedidoCliente=0 WHERE idPedido=?", [idPedido]);
    // OK status al front-end
    res.sendStatus(200);
}


lista_articulosArt.alterarPedido= async (req,res)=>{
    const {idPedido} = req.body;

    //Consultando el pedido para saber el estatus y luego cambiarlo segun se necesite
    const estatusPedido= await pool.query("SELECT * FROM factura WHERE idPedido=?", [idPedido]);
    // Numero del estatus del pedido
    const numberPedido = estatusPedido
    //Condicion que aplicara en caso de ser 1 o 2 etc
    switch (numberPedido[0].estatusPedidocliente) {
        case '1':
            //Si esta imcompleto. Cambiar a completo
            await pool.query("UPDATE factura SET estatusPedidoCliente=2 WHERE idPedido=?", [idPedido]);
            res.json("Pedido completado");
            break;
    
        case '2':
            // Si esta completo. Cambiar a imcompleto y agregar a revision de pedidos
            await pool.query("UPDATE factura SET estatusPedidoCliente=1 WHERE idPedido=?", [idPedido]);
            res.json("Pedido agregado a revision");
            break;

        case '0':
            // si esta denegado. Eliminarlo de la base de datos
            await pool.query("DELETE FROM factura WHERE idPedido=?", [idPedido]);
            res.json("Pedido eliminado");
            break;
    }
}


module.exports = lista_articulosArt;