import express from 'express';

const router = express.Router();

// import controller
import paymentController from '../../controllers/user/paymentController.js';

router.get('/', paymentController.getPayment); // get payment page
router.get('/success', paymentController.successPage); // success page

export default router;
