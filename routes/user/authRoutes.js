import express from "express";

// import controllers
import authController from '../../controller/user/authController.js'

const router = express.Router()

router.get('/register', authController.getRegister) // register page
router.post("/register", authController.postRegister) // create new user

router.get("/otp-verify", authController.getOtpVerify) // otp verification page
router.post("/otp-verify", authController.postOtpVerify) // otp verifying
router.get("/resend-otp", authController.getResendOtp) // otp resend

router.get("/login", authController.getLogin) // get login page
router.post("/login", authController.postLogin) // post login 

router.get("/forget-password", authController.getForgetPassword) // get forget password
router.post("/forget-password", authController.postForgetPassword) // post forget password
router.get("/change-password", authController.getChangePassword) // get change password
router.post("/change-password", authController.postChangePassword) // post change password


// export routes
export default router