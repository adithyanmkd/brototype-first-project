import express from 'express';

const router = express.Router();

// import controllers
import cartController from '../../controllers/user/cartController.js';

router.get('/', cartController.getCart); // get cart page
router.post('/add', cartController.addToCart); // item adding into

export default router;
