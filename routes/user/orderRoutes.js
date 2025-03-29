import express from 'express';

const router = express.Router();

import ordersController from '../../controllers/user/ordersController.js';

router.get('/', ordersController.getAllOrders); // get all order page
router.get('/:orderId', ordersController.getOrder); // get single order details
router.post('/place-order', ordersController.placeOrder); // place order
router.get('/download-invoice/:orderId', ordersController.downloadInvoice); // download invoice

export default router;
