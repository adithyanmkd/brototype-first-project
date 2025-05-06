import express from 'express';

// middlwares
import { auth } from '../../middlewares/user/auth.js';

// import controllers
import walletController from '../../controllers/user/walletController.js';

const router = express.Router();

// apply middleware to all routes
router.use(auth);

router.get('/', walletController.getWallet); // get wallet page
router.get('/transactions', walletController.getTransactions); // get all transactions
router.post('/top-up', walletController.topUpWallet); // topup wallet
router.post('/verify', walletController.verifyTopup); // verify topup

export default router;
