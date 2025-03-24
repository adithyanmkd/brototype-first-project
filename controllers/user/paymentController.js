// import configs
import redisClient from '../../config/redisConfig.js';

import { Product, Order, Address } from '../../models/index.js';

// get payment page
const getPayment = async (req, res) => {
  let user = req.session.user;
  // let userCart = await Cart.findOne({ userId: user._id });
  let cart = await redisClient.get(`cart:${user._id}`);
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
  });
};

const postPayment = async (req, res) => {
  let user = req.session.user;

  let jsonCart = await redisClient.get(`cart:${user._id}`);
  let cartItems = JSON.parse(jsonCart); // converting json into javascript object

  let addressId = await redisClient.get(`address:${user._id}`);
  let paymentMethod = req.body.method;

  let totalAmount = 0;

  // let orderedItemsFullDetails = await Promise.all(
  //   cartItems.items.map(async (item) => await Product.findById(item.productId))
  // );

  let orderedItems = await Promise.all(
    cartItems.items.map(async (item) => {
      let product = await Product.findById(item.productId);

      return {
        productId: product._doc._id,
        productName: product._doc.productName,
        quantity: item.quantity,
        price: product._doc.price.sellingPrice,
      };
    })
  );

  // calculating total price
  orderedItems.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  let address = await Address.findById(addressId);

  // accessing address for order
  let deliveryAddress = {
    name: address.name,
    phone: address.phone,
    address: address.address,
    locality: address.locality,
    district: address.district,
    state: address.state,
    pincode: address.pincode,
  };

  try {
    let newOrder = new Order({
      userId: user._id,
      orderedItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    });

    await newOrder.save();

    // descrease the quantity from the product
    cartItems.items.map(async (item) => {
      let product = await Product.findById(item.productId);
      product.quantity -= item.quantity;
      await product.save();
    });

    // remove cart items and address
    await redisClient.del(`cart:${user._id}`, `address:${user._id}`);
    res.status(200).json({ success: true, message: 'Order placed' });
  } catch (error) {
    console.error({ Error: 'Error from post payment method controller' });
  }
};

// get success page
const successPage = (req, res) => {
  res.render('user/pages/payment/success.ejs');
};

const paymentController = {
  getPayment,
  postPayment,
  successPage,
};

export default paymentController;
