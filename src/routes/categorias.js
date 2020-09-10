const {Router} = require('express');
const router = Router();
const {getCategoria, createCategoria,getCategoriawithID, deleteCategoria, updateCategoria}  = require('../controllers/categoria_controller');

router.route('/')
    .get(getCategoria) // Obtiene todo las categorias en la db
    .post(createCategoria)
    .delete(deleteCategoria)
    .put(updateCategoria);
    
// con un url en especial asi no se compromete el id por el URL (investigar al respecto)
router.route('/getCategoria') 
    .post(getCategoriawithID) // 

    


module.exports=router;