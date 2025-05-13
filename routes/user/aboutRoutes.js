import express from 'express';

const router = express.Router();

import aboutController from '../../controllers/user/aboutController.js';

// address routes
router.get('/', aboutController.getAboutPage); // get about page

export default router;
