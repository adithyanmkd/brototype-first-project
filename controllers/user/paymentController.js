// import configs
import redisClient from '../../config/redisConfig.js';
import razorpay from '../../config/razorpay.js';

// import models
import { Product, Order, Address } from '../../models/index.js';

// import services
import { prepareOrderData } from '../../services/user/orderService.js';

let paymentMethods = [
  {
    name: 'Cash On delivery',
    value: 'cash_on_delivery',
  },
  {
    name: 'Wallet',
    value: 'wallet',
  },
  {
    name: 'Razorpay',
    value: 'razorpay',
  },
];

// get payment page
const getPayment = async (req, res) => {
  let user = req.session.user;
  // let userCart = await Cart.findOne({ userId: user._id });

  if (!user) {
    return res.redirect('/auth/login');
  }
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

  let jsonCart = await redisClient.get(`cart:${user._id}`);
  let jsonCouponDiscount = await redisClient.get(`couponDiscount:${user._id}`);

  let couponDiscount = JSON.parse(jsonCouponDiscount) || 0;
  let cartItems = JSON.parse(jsonCart); // converting json into javascript object

  let addressId = await redisClient.get(`address:${user._id}`);
  let paymentMethod = req.body.method;

  let totalAmount = 0;

  if (!cartItems) {
    return res.status(404).json({ success: false, message: 'cart is empty!' });
  }

  let cardImagePaths = []; // all product card images for thumbnail

  let orderedItems = await Promise.all(
    cartItems.items.map(async (item) => {
      let product = await Product.findById(item.productId);
      cardImagePaths.push(product.images.cardImage.path); // images pushing for order thumbnails

      return {
        productId: product._doc._id,
        productName: product._doc.productName,
        thumbnail: product._doc.images.cardImage.path,
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
    // cash on delivery method logic
    if (paymentMethod === 'cash_on_delivery') {
      let newOrder = new Order({
        userId: user._id,
        orderedItems,
        orderThumbnail: cardImagePaths[0], // now displaying 1st card image thumnail or oder list page
        productName: orderedItems[0].productName,
        totalAmount,
        paymentMethod,
        deliveryAddress,
        discountAmount: Number(couponDiscount),
      });

      await newOrder.save();

      // descrease the quantity from the product
      cartItems.items.map(async (item) => {
        let product = await Product.findById(item.productId);
        product.quantity -= item.quantity;
        await product.save();
      });

      // remove cart items and address
      await redisClient.del(
        `cart:${user._id}`,
        `address:${user._id}`,
        `couponDiscount:${user._id}`
      );

      let coupon = await redisClient.get(`couponDiscount:${user._id}`);
      let cart = await redisClient.get(`couponDiscount:${user._id}`);
      console.log(coupon, '-------- coupon --------');
      console.log(cart, '-------- cart --------');

      res.status(200).json({
        success: true,
        message: 'Order placed throuch cash on delivery',
      });
    } else if (paymentMethod === 'razorpay') {
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
    } else {
      return res
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

  if (paymentMethod == 'cash_on_delivery') {
    return res.render('user/pages/payment/success.ejs');
  }

  let jsonCart = await redisClient.get(`cart:${user._id}`);
  let jsonCouponDiscount = await redisClient.get(`couponDiscount:${user._id}`);
  let addressId = await redisClient.get(`address:${user._id}`);

  let couponDiscount = JSON.parse(jsonCouponDiscount) || 0;
  let cartItems = JSON.parse(jsonCart); // converting json into javascript object

  let totalAmount = 0;

  let cardImagePaths = []; // all product card images for thumbnail

  let orderedItems = await Promise.all(
    cartItems.items.map(async (item) => {
      let product = await Product.findById(item.productId);
      cardImagePaths.push(product.images.cardImage.path); // images pushing for order thumbnails

      return {
        productId: product._doc._id,
        productName: product._doc.productName,
        thumbnail: product._doc.images.cardImage.path,
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

  if (paymentMethod === 'razorpay') {
    try {
      let newOrder = new Order({
        userId: user._id,
        orderedItems,
        orderThumbnail: cardImagePaths[0], // now displaying 1st card image thumnail or oder list page
        productName: orderedItems[0].productName,
        discountAmount: couponDiscount,
        totalAmount: totalAmount - couponDiscount,
        paymentMethod,
        deliveryAddress,
        paymentStatus: 'paid',
      });

      await newOrder.save();

      // descrease the quantity from the product
      cartItems.items.map(async (item) => {
        let product = await Product.findById(item.productId);
        product.quantity -= item.quantity;
        await product.save();
      });

      // remove cart items and address
      await redisClient.del(
        `cart:${user._id}`,
        `address:${user._id}`,
        `couponDiscount:${user._id}`
      );

      return res.json({
        success: true,
        redirect: '/payment/success-view',
        message: 'successfully order placed through razorpay',
      });
    } catch (error) {
      console.error(error, {
        message: 'Error while creating new order from razorpay',
      });
    }
  }
};

const successView = (req, res) => {
  return res.render('user/pages/payment/success.ejs');
};

const paymentFailed = async (req, res) => {
  let user = req.session.user;

  try {
    // creating new order
    let newOrder = await prepareOrderData(user._id);

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

const paymentController = {
  getPayment,
  postPayment,
  successPage,
  successView,
  paymentFailed,
};

export default paymentController;
