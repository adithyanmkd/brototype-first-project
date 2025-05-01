import express from 'express';

const router = express.Router();

import addressController from '../../controllers/user/addressController.js';

// address routes
router.get('/', addressController.getAddress); // address page
router.post('/', addressController.postAddAddress); // post add address
router.get('/edit/:id', addressController.getAddressEdit); // get address edit page
router.post('/edit', addressController.postEditAddress); // post edit address
router.post('/:id/delete', addressController.postDeleteAddress); // delete address

export default router;
