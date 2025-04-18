import express from 'express';

const router = express.Router();

// import routes
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import customerRoutes from './customerRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import ordersRoutes from './ordersRoutes.js';
import coupons from './couponRoutes.js';
import salesReportRoutes from './salesReportRoutes.js';

router.use('/auth', authRoutes); // auth routes
router.use('/', dashboardRoutes); // dashboard routes
router.use('/customers', customerRoutes); // customer controller routes
router.use('/categories', categoryRoutes); // category routes
router.use('/products', productRoutes); // product routes
router.use('/orders', ordersRoutes); // orders routes
router.use('/coupons', coupons); // coupon routes
router.use('/sales-report', salesReportRoutes); // sales report routes

// export router
export default router;
