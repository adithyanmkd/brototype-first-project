import express from 'express'

const router = express.Router()

// import controller
import homeController from '../../controllers/user/homeController.js'

router.get('/', homeController.getIndex) // get home page

// export router
export default router