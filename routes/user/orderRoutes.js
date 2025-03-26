import express from 'express';

const router = express.Router();

import ordersController from '../../controllers/user/ordersController.js';

router.get('/', orderController.getAllOrders); // get all order page
router.post('/place-order', ordersController.placeOrder); // place order

export default router;
