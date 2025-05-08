import redisClient from '../../config/redisConfig.js';
import { Product, Order, Address } from '../../models/index.js';
import { walletService } from './walletService.js';

// import utils
import { generateTransactionId } from '../../utils/generateTxnID.js';

let orderService = {
  getCartSummery: async ({ userId }) => {
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
  },

  // order creating
  createOrder: async ({ userId, paymentMethod }) => {
    try {
      // fetching raw data from redis for create order
      let addressId = await redisClient.get(`address:${userId}`); // this is not raw data

      let address = await Address.findById(addressId); // find address by id

      let { cardImagePaths, totalAmount, discount, orderedItems } =
        await orderService.getCartSummery({ userId });

      console.log(orderedItems);

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
      let newOrder = await Order.create({
        userId,
        orderedItems,
        orderThumbnail: cardImagePaths[0], // now displaying 1st card image thumnail or oder list page
        productName: orderedItems[0].productName,
        discountAmount: discount,
        totalAmount: totalAmount - discount,
        paymentMethod,
        deliveryAddress,
      });

      // descrease the quantity from the product
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
        error,
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
};

export default orderService;
