const {Router} = require('express');
const router = Router();

const {addToCart, supportTicket, devolver, getOrder, getCart, pay, alterarPedido, denyOrder} = require('../controllers/store_controller');

router.route('/')
    .put(addToCart) // Agrega al carrito
    .post(pay) // hacer pedido
    .delete(devolver)

router.route('/orderChange')
    .post(alterarPedido)
    .put(denyOrder)

router.route('/supportTicket')
    .post(supportTicket)

router.route('/getPedidos')
    .post(getOrder)

router.route('/getCart') 
    // Obtener el carrito
    .post(getCart)

    //.delete(deletePerfil) // elimina en la lista de articulos
    
// con un url en especial asi no se compromete el id por el URL (investigar al respecto)
//router.route('/getPerfil') 
  //  .post(getPerfil) // obtiene un perfil en concreto
    
    


module.exports=router;