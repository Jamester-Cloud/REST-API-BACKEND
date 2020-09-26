const {Router} = require('express');
const router = Router();
///Control import
const {getArt, addArt, updateArt, deleteArt, getArtWithId} = require('../controllers/articulos_controller');

router.route('/')
    .get(getArt)
    .post(addArt)
    .put(updateArt)
    .delete(deleteArt);
// para obtener un articulo

router.route('/getArt')
    .post(getArtWithId)
    

module.exports=router;

