import express from 'express';

const router = express.Router();

// import controller
import paymentController from '../../controllers/user/paymentController.js';

router.get('/', paymentController.getPayment); // get payment page
router.post('/', paymentController.postPayment); // post payment
router.get('/success', paymentController.successPage); // success page
router.get('/success-view', paymentController.successView); // success page
router.get('/payment-failed', paymentController.paymentFailed); // payment failed page
router.post('/verify', paymentController.verifyPayment); // retry verify route

export default router;
