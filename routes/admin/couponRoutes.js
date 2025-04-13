import express from 'express';

// import controllers
import couponController from '../../controllers/admin/couponController.js';

// import middlewares

const router = express.Router();

router.get('/', couponController.coupons); // get coupon list page
router.post('/add', couponController.addCoupon); // add coupon
router.post('/edit', couponController.editCoupon); // edit coupon

export default router;
