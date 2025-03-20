import express from 'express';

// import config modules
import passport from '../../config/passport.js';

// import controllers
import authController from '../../controllers/user/authController.js';

const router = express.Router();

router.get('/register', authController.getRegister); // register page
router.post('/register', authController.postRegister); // create new user

router.get('/otp-verify', authController.getOtpVerify); // otp verification page
router.post('/otp-verify', authController.postOtpVerify); // otp verifying
router.get('/resend-otp', authController.getResendOtp); // otp resend

router.get('/login', authController.getLogin); // get login page
router.post('/login', authController.postLogin); // post login

router.get('/forget-password', authController.getForgetPassword); // get forget password
router.post('/forget-password', authController.postForgetPassword); // post forget password
router.get('/change-password', authController.getChangePassword); // get change password
router.post('/change-password', authController.postChangePassword); // post change password

// Google login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/'); // Redirect to home on success
  }
);

// export routes
export default router;
