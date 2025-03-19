import express from 'express'

// import routes
import homeRoutes from './homeRoutes.js'
import authRoutes from './authRoutes.js'
import productRoutes from "./productRoutes.js"
import profileRoutes from "./profileRoutes.js"

// import middlewares
import navLinks from '../../middlewares/user/navLinks.js'

const router = express.Router()

router.use(navLinks) // middleware using

router.use("/", homeRoutes) // home page routes
router.use("/auth", authRoutes) // authentication routes
router.use("/products", productRoutes) // product routes
router.use("/account", profileRoutes) // profile routes
// export router
export default router