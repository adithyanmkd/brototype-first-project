import crypto from 'crypto';

// configs
import razorpay from '../../config/razorpay.js';

// import services
import { walletService } from '../../services/user/walletService.js';

// import utils
import getUserMenus from '../../utils/getSidebarMenus.js';
import verifyRazorpaySignature from '../../utils/verifyRazorpaySignature.js';

// get wallet page
const getWallet = async (req, res) => {
  const user = req.session.user;
  let userId = user._id;

  try {
    let wallet = await walletService.getWallet({ userId });
    let transactions = await walletService.getTransactions({ userId });

    let menus = getUserMenus(user); // fetching user menus

    res.render('user/pages/profile/wallet.ejs', {
      user,
      menus,
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

// top up wallet
const topUpWallet = async (req, res) => {
  let user = req.session.user;
  let amount = Number(req.body.amount);

  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    let razorpayOptions = {
      user,
      order,
      amount,
      key: process.env.RAZORPAY_KEY_ID,
    };

    return res.status(200).json({
      success: true,
      message: 'proceed to razorpay payment',
      ...razorpayOptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'wallet topup failed on server',
      error,
    });
  }
};

// verify topup
const verifyTopup = async (req, res) => {
  let user = req.session.user;

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } =
    req.body;

  try {
    let result = await walletService.topup({
      userId: user._id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      amount,
    });

    console.log(result);

    if (!result) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong in wallet topup',
    });
  }
};

// export controller
let walletController = {
  getWallet,
  topUpWallet,
  verifyTopup,
};

export default walletController;
