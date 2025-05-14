import express from 'express';

//import controllers
import productController from '../../controllers/user/productController.js';

//user router created
const router = express.Router();

router.get('/', productController.products); // all products page
router.get('/:id', productController.productDetails); // display full product details

// export router
export default router;
