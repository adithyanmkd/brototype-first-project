import express from 'express';

// import routes
import homeRoutes from './homeRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import profileRoutes from './profileRoutes.js';
import cartRoutes from './cartRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';
import paymentRoutes from './paymentRoutes.js';

// import middlewares
import navLinks from '../../middlewares/user/navLinks.js';

const router = express.Router();

router.use(navLinks); // middleware using

router.use('/', homeRoutes); // home page routes
router.use('/auth', authRoutes); // authentication routes
router.use('/products', productRoutes); // product routes
router.use('/account', profileRoutes); // profile routes
router.use('/cart', cartRoutes); // cart routes
router.use('/checkout', checkoutRoutes); // checkout routes
router.use('/payment', paymentRoutes); // payment routes

// export router
export default router;
