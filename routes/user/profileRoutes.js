import express from 'express';

const router = express.Router();

// import controllers
import profileController from '../../controllers/user/profileControllers.js';
import orderController from '../../controllers/user/orderController.js';

router.get('/my-details', profileController.userDetails); // get user detail page
router.get('/my-details/:id', profileController.getEditProfile); // get edit profile page
router.post('/my-details/:id', profileController.postEditProfile); // post edit profile

router.get('/change-password', profileController.getPasswordChange); // get password change page
router.post('/change-password', profileController.postChangePassword); // post change password

router.get('/address', profileController.getAddress); // address page
router.post('/address', profileController.postAddAddress); // post add address
router.post('/address/:id/delete', profileController.postDeleteAddress); // delete address

router.get('/orders', orderController.getAllOrders); // get all orders

export default router;
