import mongoose from 'mongoose';

// import models
import { Wallet } from '../../models/index.js';

// import profile side menus
import menus from '../../datasets/profileMenus.js';
import WalletTransaction from '../../models/walletTransactionModel.js';

// get wallet page
const getWallet = async (req, res) => {
  const user = req.session.user;
  let userId = req.user._id;

  try {
    let wallet = await Wallet.findOne({ userId });
    let transactions = await WalletTransaction.find({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
      });
    }

    const userMenus = [...menus]; // profile menus accessing

    // google user no need of password change
    if (!user.isGoogleUser) {
      userMenus.splice(1, 0, {
        name: 'Password',
        href: '/account/change-password',
      });
    }

    console.log(transactions);

    res.render('user/pages/profile/wallet.ejs', {
      user,
      menus: userMenus,
      wallet,
      transactions,
    });
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      success: false,
      message: 'Get wallet page controller failed!',
      Error: error,
    });
  }
};

// export controller
let walletController = {
  getWallet,
};

export default walletController;
