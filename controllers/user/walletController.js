import mongoose from 'mongoose';

// import profile side menus
import menus from '../../datasets/profileMenus.js';

// import services
import { walletService } from '../../services/user/walletServie.js';

// get wallet page
const getWallet = async (req, res) => {
  const user = req.session.user;
  let userId = user._id;

  try {
    let { wallet, transactions } = await walletService.find(userId);

    const userMenus = [...menus]; // profile menus accessing

    // google user no need of password change
    if (!user.isGoogleUser) {
      userMenus.splice(1, 0, {
        name: 'Password',
        href: '/account/change-password',
      });
    }

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
