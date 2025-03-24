import express from 'express';

const router = express.Router();

// import controllers
import cartController from '../../controllers/user/cartController.js';

router.get('/', cartController.getCart); // get cart page
router.post('/', cartController.postCart); // post cart
router.get('/empty', cartController.getEmptyCart); // get empty cart
router.post('/add', cartController.addToCart); // item adding into
router.post('/delete', cartController.deleteItem); // item adding into

export default router;
