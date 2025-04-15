import express from 'express';

const router = express.Router();

// import controllers
import ordersController from '../../controllers/user/ordersController.js';

// import middlewares
import { auth } from '../../middlewares/user/auth.js';

router.use(auth);

router.get('/', ordersController.getAllOrders); // get all order page
router.get('/:orderId', ordersController.getOrder); // get single order details
router.post('/place-order', ordersController.placeOrder); // place order
router.get('/download-invoice/:orderId', ordersController.downloadInvoice); // download invoice
router.post('/return', ordersController.returnOrder); // return order
router.post('/cancel', ordersController.cancelOrder); // cancel order

export default router;
