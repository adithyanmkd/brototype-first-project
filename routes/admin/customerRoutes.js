import express from 'express'

const router = express.Router()

// import controller
import customerController from '../../controllers/admin/customerController.js'

router.get('/', customerController.getCustomers) // get customers
router.post('/:id/toggle-block', customerController.toggleBlock) // block or unblock user

// export router
export default router
