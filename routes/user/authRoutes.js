import express from "express";

// import controllers
import authController from '../../controller/user/authController.js'

const router = express.Router()

router.get('/register', authController.getRegister) // register page
router.post("/register", authController.postRegister) // create new user

router.get("/otp-verify", authController.getOtpVerify) // otp verification page
router.post("/otp-verify", authController.postOtpVerify) // otp verifying
router.get("/resend-otp", authController.getResendOtp) // otp resend


// export routes
export default router