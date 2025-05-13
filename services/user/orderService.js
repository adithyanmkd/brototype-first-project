import redisClient from '../../config/redisConfig.js';
import { Product, Order, Address } from '../../models/index.js';
import { walletService } from './walletService.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Import utils
import { generateTransactionId } from '../../utils/generateTxnID.js';
import verifyRazorpaySignature from '../../utils/verifyRazorpaySignature.js';

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

let orderService = {
  getCartSummery: async ({ userId }) => {
    try {
      // fetching raw data from redis for create order
      let cartRaw = await redisClient.get(`cart:${userId}`);
      let discountRaw = await redisClient.get(`couponDiscount:${userId}`);

      // parse raw data into object
      let cart = JSON.parse(cartRaw);

      let discount =
        JSON.parse(discountRaw).trim() !== '' ? JSON.parse(discountRaw) : 0;

      let cardImagePaths = [];

      let orderedItems = await Promise.all(
        cart.items.map(async (item) => {
          let product = await Product.findById(item.productId);

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

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
      let totalAmount = orderedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        orderedItems,
        totalAmount,
        discount,
        cardImagePaths,
      };
    } catch (error) {
      console.error(error);
    }
  },

  // order creating
  createOrder: async ({ userId, paymentMethod }) => {
    try {
      // fetching raw data from redis for create order
      let addressId = await redisClient.get(`address:${userId}`); // this is not raw data

      let address = await Address.findById(addressId); // find address by id

      let { cardImagePaths, totalAmount, discount, orderedItems } =
        await orderService.getCartSummery({ userId });

      if (totalAmount > 1000 && paymentMethod === 'cash_on_delivery') {
        let error = new Error(
          'Cash on delivery not possible for amounts above 1000'
        );
        throw error;
      }

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

      // new order creating
      let newOrder = new Order({
        userId,
        orderedItems,
        orderThumbnail: cardImagePaths[0], // now displaying 1st card image thumnail or oder list page
        productName: orderedItems[0].productName,
        discountAmount: discount,
        totalAmount: totalAmount - discount,
        paymentMethod,
        deliveryAddress,
      });

      // switch (paymentMethod) {
      //   case 'razaropay':
      //   case 'wallet':
      //     newOrder.paymentStatus = 'paid';
      // }

      // newOrder.save(); // order saving

      // decrease the quantity from the product
      for (let item of orderedItems) {
        let product = await Product.findById(item.productId);
        product.quantity -= item.quantity;
        await product.save();
      }

      // remove cart items and address
      await redisClient.del(
        `cart:${userId}`,
        `address:${userId}`,
        `couponDiscount:${userId}`
      );

      return {
        success: true,
        message: 'order created successfully',
        order: newOrder,
        redirect: '/payment/success-view',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'order creation failed!',
        error: error.message,
      };
    }
  },

  // cancel order
  cancelOrder: async ({ userId, orderId, response }) => {
    try {
      let wallet = await walletService.getWallet({ userId });
      let order = await Order.findOne({ _id: orderId, userId });

      let items = order.orderedItems.forEach(async (item) => {
        let product = await Product.findOne({ _id: item.productId });
        product.quantity += item.quantity;
        await product.save();
      });

      let paymentMethods = ['wallet', 'razorpay'];

      // if user paid then return give money back
      if (paymentMethods.includes(order.paymentMethod)) {
        let calculatedRefund = order.totalAmount - order.discountAmount;
        wallet.balance += calculatedRefund;
        await wallet.save();

        // creating new transaction for refund
        let description = 'Refund for the cancelled order has been credited';
        let newTransaction = await walletService.createTransaction({
          userId,
          amount: calculatedRefund,
          description,
          orderId,
          transactionId: generateTransactionId(),
          transactionNote: description,
          type: 'credit',
        });

        order.paymentStatus = 'refunded';
      }

      // updating order
      order.orderStatus = 'Cancelled';
      order.cancelReason = response;
      order.save();

      return {
        success: true,
        message: 'Order cancelled succesfully.',
        redirect: `/account/orders/${orderId}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Order cancellation failed.',
      };
    }
  },

  // Retry payment
  retryPayment: async ({ orderId, userId }) => {
    // console.log('Order ID: ', orderId);
    try {
      const order = await Order.findOne({ _id: orderId, userId });
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.paymentStatus !== 'failed') {
        throw new Error('Payment retry not applicable');
      }

      // Increment retry attempts
      order.retryAttempts = (order.retryAttempts || 0) + 1;
      if (order.retryAttempts > 3) {
        throw new Error('Maximum retry attempts reached');
      }

      // Create a new Razorpay order for retry
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: (order.totalAmount - (order.discountAmount || 0)) * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `order_${order._id}_retry_${order.retryAttempts}`,
      });

      // Update order with the new Razorpay order ID
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return {
        success: true,
        message: 'Retry payment initiated',
        order,
        razorpayOrderId: razorpayOrder.id,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Retry payment failed',
        error: error.message,
      };
    }
  },

  // Verify payment after retry
  verifyPayment: async ({
    orderId,
    userId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  }) => {
    try {
      console.log('verify payment service');
      const order = await Order.findOne({
        _id: orderId,
        userId,
        razorpayOrderId: razorpay_order_id,
      });

      let details = {
        orderId,
        userId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      };

      // console.log('Details Log: ', details);

      if (!order) {
        throw new Error('Order not found');
      }

      // Verify payment signature using the utility function
      const isSignatureValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isSignatureValid) {
        order.paymentStatus = 'failed';
        await order.save();
        throw new Error('Payment verification failed');
      }

      // Update order status on successful payment
      order.paymentStatus = 'paid';
      order.orderStatus = 'Pending'; // Move order to Pending state after payment
      order.retryAttempts = 0; // Reset retry attempts
      await order.save();

      // console.log(order, 'order log');

      return {
        success: true,
        message: 'Payment verified successfully',
        redirect: `/account/orders/${order._id}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Payment verification failed',
        error: error.message,
      };
    }
  },
};

export default orderService;
