import express from 'express';

// import controllers
import ordersController from '../../controllers/admin/ordersController.js';

const router = express.Router();

router.get('/', ordersController.getOrders); // get orders list page
router.get('/:orderId', ordersController.getOrder); // get single order details page
router.post('/update-order-status', ordersController.updateOrderStatus); // update order status

// export router
export default router;
