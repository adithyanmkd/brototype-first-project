import express from 'express'

const router = express.Router()

// import routes
import authRoutes from './authRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
// import customerRoutes from './customerRoutes.js'
// import productRoutes from './productRoutes.js'
// import categoryRoutes from './categoryRoutes.js'

router.use('/auth', authRoutes) // auth routes
router.use('/', dashboardRoutes) // dashboard routes
// router.use('/customers', customerRoutes) // customer controller routes
// router.use('/products', productRoutes) // product routes
// router.use('/categories', categoryRoutes) // category routes

// export router
export default router