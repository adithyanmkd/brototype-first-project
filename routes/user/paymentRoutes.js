import express from 'express';

const router = express.Router();

// import controller
import paymentController from '../../controllers/user/paymentController.js';

router.get('/', paymentController.getPayment); // get payment page
router.post('/', paymentController.postPayment); // post payment
router.get('/success', paymentController.successPage); // success page
router.get('/success-view', paymentController.successView); // success page

export default router;
