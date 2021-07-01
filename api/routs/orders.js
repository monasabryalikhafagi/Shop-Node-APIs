const express=require('express');
const router=express.Router();
const checkAuth = require('../middleware/check-auth');
const ordersControllers=require('../controllers/orders');


  
router.get('/',checkAuth,ordersControllers.getOrders);
router.post('/',checkAuth,ordersControllers.addOrder);
router.get('/:ordeId',checkAuth,ordersControllers.getOrder);
router.patch('/:orderId',checkAuth,ordersControllers.updateOrder);
router.delete('/:orderId',checkAuth,ordersControllers.deleteOrder);

module.exports=router;