import express from "express";

// import controllers
import authController from '../../controller/user/authController.js'

const router = express.Router()

router.get('/register', authController.getRegister) // register page


// export routes
export default router