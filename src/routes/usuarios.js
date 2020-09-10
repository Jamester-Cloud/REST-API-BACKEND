const {Router} = require('express');
const router = Router();

const {getUsuarios, updateUser, blockUsers, AdminDashboard, getUser, activeUser} = require('../controllers/user_controller');

router.route('/')
    .get(getUsuarios) // Obtiene todo los perfiles en la db  
    .delete(blockUsers) // Bloquea un usuario
    .put(updateUser)
// con un url en especial asi no se compromete el id por el URL (investigar al respecto)
router.route('/getUser') 
    .post(getUser) 

router.route('/activeUser')
    .post(activeUser)


router.route('/admin')
    .post(AdminDashboard)

module.exports=router;