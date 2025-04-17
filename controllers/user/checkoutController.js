// import config files
import redisClient from '../../config/redisConfig.js';

import { Cart, Product, Address } from '../../models/index.js';

// get checkout page
let getCheckout = async (req, res) => {
  let user = req.session.user;

  if (!user) {
    return res.render('user/pages/auth/login.ejs');
  }
  let addresses = await Address.find({ userId: user._id }); // finding user addresses
  // let userCart = await Cart.findOne({ userId: user._id });
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

  res.render('user/pages/checkout/checkout.ejs', {
    totalItems,
    totalSellingPrice:
      totalSellingPrice - Number(JSON.parse(couponDiscount)) || 0,
    totalOriginalPrice,
    addresses,
    couponDiscount,
  });
};

// post checkout page
let postCheckout = async (req, res) => {
  let user = req.session.user;

  try {
    await redisClient.set(`address:${user._id}`, req.body.addressId);

    res.status(200).json({
      success: true,
      message: 'successfully added address into redisClient',
    });
  } catch (error) {
    console.error({
      Error: error,
      message: 'Error from postCheckout controller',
    });
  }
};

const checkoutController = {
  getCheckout,
  postCheckout,
};

export default checkoutController;
