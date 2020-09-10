const {Router} = require('express');
const router = Router();

const {getPerfiles, createPerfil, deletePerfil, updatePerfil, getPerfil} = require('../controllers/perfil_control');

router.route('/')
    .get(getPerfiles) // Obtiene todo los perfiles en la db
    .post(createPerfil) // crea un perfil
    .put(updatePerfil) // Actualiza un perfil
    .delete(deletePerfil) // elimina un perfil
    
// con un url en especial asi no se compromete el id por el URL (investigar al respecto)
router.route('/getPerfil') 
    .post(getPerfil) // obtiene un perfil en concreto
    
    


module.exports=router;