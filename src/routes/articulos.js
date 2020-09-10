const {Router} = require('express');
const router = Router();
///Control import
const {getArt, addArt, updateArt, deleteArt, getArtWithId} = require('../controllers/articulos_controller');

router.route('/')
    .get(getArt)
    .post(addArt)
    .put(updateArt)
    .delete(deleteArt);

router.route('/getArt')
    .post(getArtWithId)
    

module.exports=router;

