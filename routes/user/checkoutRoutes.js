import express from 'express';

const router = express.Router();

// import controller
import checkoutController from '../../controllers/user/checkoutController.js';

router.get('/', checkoutController.getCheckout); // get checkout page
router.post('/', checkoutController.postCheckout); // post checkout page

export default router;
