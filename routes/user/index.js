import express from 'express'

// import routes
// import homeRoutes from './homeRoutes.js'
import authRoutes from './authRoutes.js'

const router = express.Router()


// router.use("/", homeRoutes) // home page routes
router.use("/auth", authRoutes) // authentication routes


// export router
export default router