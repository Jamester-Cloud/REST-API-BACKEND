const {Router} = require('express');
const router = Router();
///Control import
const {getClients, addClient, updateClient, deleteClient, getClientWithId} = require('../controllers/clientes_controller');

router.route('/')
    .get(getClients)
    .post(addClient)
    .put(updateClient)
    .delete(deleteClient);

router.route('/getClient')
    .post(getClientWithId)
    

module.exports=router;