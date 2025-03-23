import express from 'express';

const router = express.Router();

import orderController from '../../controllers/user/orderController.js';

router.get('/', orderController.getAllOrders); // get all order page
router.post('/place-order', orderController.placeOrder); // place order

export default router;
