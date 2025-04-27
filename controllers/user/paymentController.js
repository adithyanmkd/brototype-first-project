// import configs
import redisClient from '../../config/redisConfig.js';
import razorpay from '../../config/razorpay.js';

// import models
import { Product, Order, Address } from '../../models/index.js';

// import services
import orderService from '../../services/user/orderService.js';
import { walletService } from '../../services/user/walletServie.js';

// get payment page
const getPayment = async (req, res) => {
  let user = req.session.user;

  let wallet = await walletService.getWallet({ userId: user._id });

  let paymentMethods = [
    {
      name: 'Cash On delivery',
      value: 'cash_on_delivery',
    },
    {
      name: 'Wallet',
      value: 'wallet',
      balance: wallet.balance,
    },
    {
      name: 'Razorpay',
      value: 'razorpay',
    },
  ];

  let cart = await redisClient.get(`cart:${user._id}`);
  let couponDiscount = await redisClient.get(`couponDiscount:${user._id}`);

  let userCart = JSON.parse(cart);

  // calcalated prices
  let totalSellingPrice = 0;
  let totalOriginalPrice = 0;

  if (!userCart) {
    return res.render('user/pages/cart/emptyCart.ejs');
  }

  let cartItems = await Promise.all(
    userCart.items.map(async (item) => {
      let product = await Product.findById(item.productId);

      return {
        ...product,
        quantity: item.quantity,
      };
    })
  );

  let totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // calculating total quantity

  cartItems.forEach((item) => {
    totalSellingPrice += item._doc.price.sellingPrice * item.quantity;
    totalOriginalPrice += item._doc.price.originalPrice * item.quantity;
  });

  res.render('user/pages/payment/payment.ejs', {
    totalItems,
    totalSellingPrice,
    totalOriginalPrice,
    paymentMethods,
    couponDiscount,
  });
};

const postPayment = async (req, res) => {
  let user = req.session.user;
  let paymentMethod = req.body.method;

  try {
    switch (paymentMethod) {
      case 'cash_on_delivery': {
        let result = await orderService.createOrder({
          userId: user._id,
          paymentMethod,
        });
        return res.status(200).json(result);
      }

      case 'razorpay': {
        let result = await orderService.createOrder({
          userId: user._id,
          paymentMethod,
        });

        let totalAmount = result.order.totalAmount; // total amout accessing from order

        const options = {
          amount: totalAmount * 100,
          currency: 'INR',
          payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);

        let razorpayOptions = {
          user,
          order,
          totalAmount,
          key: process.env.RAZORPAY_KEY_ID,
        };

        return res.status(200).json({
          success: true,
          message: 'proceed to razorpay payment',
          ...razorpayOptions,
        });
      }

      case 'wallet': {
        const result = await walletService.purchaseWithWallet({
          userId: user._id,
        });

        if (!result.success) {
          return res.status(500).json(result);
        }

        return res.status(200).json(result);
      }
      default:
        res
          .status(400)
          .json({ success: false, message: 'Invalid payment method' });
    }
  } catch (error) {
    console.error({
      Error: 'Error from post payment method controller',
      error,
    });
  }
};

// get success page
const successPage = async (req, res) => {
  let user = req.session.user;
  let paymentMethod = req.query.payment_method;

  switch (paymentMethod) {
    case 'cash_on_delivery':
    case 'wallet':
      return res.render('user/pages/payment/success.ejs');
    case 'razorpay':
      return res.status(200).json({
        success: true,
        message: 'success page',
        redirect: '/payment/success-view',
      });
  }
};

// order success page
const successView = (req, res) => {
  return res.render('user/pages/payment/success.ejs');
};

// order failed page
const paymentFailed = async (req, res) => {
  let user = req.session.user;
  let paymentMethod = 'razorpay';

  try {
    // creating new order
    let result = await orderService.createOrder({
      userId: user._id,
      paymentMethod,
    });

    // find the most recent order with pending status
    let lastPendingOrder = await Order.findOne({
      userId: user._id,
      orderStatus: 'Pending',
    }).sort({ createdAt: -1 });

    // change the payment status of the new order
    if (lastPendingOrder) {
      lastPendingOrder.orderStatus = 'Order Failed';
      lastPendingOrder.paymentStatus = 'failed';
      lastPendingOrder.save();
    }

    return res.render('common/error/paymentFailed.ejs');
  } catch (error) {
    console.error(error);
  }
};

// exporting all controllers
const paymentController = {
  getPayment,
  postPayment,
  successPage,
  successView,
  paymentFailed,
};

export default paymentController;
