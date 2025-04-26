import express from 'express';

const router = express.Router();

// import controllers
import profileController from '../../controllers/user/profileControllers.js';

// import middlewares
import { auth } from '../../middlewares/user/auth.js';

// import routes
import orderRoutes from './orderRoutes.js';
import walletRoutes from './walletRoutes.js';

router.use(auth); // apply auth middleware to all

router.get('/my-details', profileController.userDetails); // get user detail page
router.get('/my-details/:id', profileController.getEditProfile); // get edit profile page
router.post('/my-details/:id', profileController.postEditProfile); // post edit profile

router.get('/change-password', profileController.getPasswordChange); // get password change page
router.post('/change-password', profileController.postChangePassword); // post change password

// address routes
router.get('/address', profileController.getAddress); // address page
router.post('/address', profileController.postAddAddress); // post add address
router.get('/address/edit/:id', profileController.getAddressEdit); // get address edit page
router.post('/address/edit', profileController.postEditAddress); // post edit address
router.post('/address/:id/delete', profileController.postDeleteAddress); // delete address

router.use('/orders', orderRoutes); // all order routes

router.get('/wishlist', profileController.getWishlist); // get wishlist page
router.post('/wishlist', profileController.postWishlist); // adding product into wishlist
router.delete('/wishlist/delete/:productId', profileController.deleteWishlist); // delete wishlist item

router.use('/wallet', walletRoutes); // all wallet routes

export default router;
