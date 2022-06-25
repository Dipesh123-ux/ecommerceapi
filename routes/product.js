const express =  require('express');

const router =  express.Router();

const {create,list,remove,update,read} = require('../controllers/product')

router.get('/products',list);
router.post('/product',create);
router.get('/product/:id',read);
router.delete('/product/:id',remove);
router.put('/product/:id',update);

module.exports = router;

