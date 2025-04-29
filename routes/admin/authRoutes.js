import express from 'express';

//import controllers
import authController from '../../controllers/admin/authController.js';

const router = express.Router();

router.get('/login', authController.getLogin); // get login page
router.post('/login', authController.authenticateAdmin); // post login page
router.get('/logout', authController.adminLogout); // admin logout

// export routes
export default router;
