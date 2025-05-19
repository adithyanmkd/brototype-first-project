import redisClient from '../../config/redisConfig.js';

import { Product } from '../../models/index.js';

const CartService = {
  updateCart: async (userId, cartItems, couponDiscount = 0) => {
    try {
      let userCart = await redisClient.get(`cart:${userId}`);
      let cart = JSON.parse(userCart);

      cartItems.forEach((item) => {
        let existingItemIndex = cart.items.findIndex(
          (existItem) => item.productId === existItem.productId
        );

        if (existingItemIndex !== -1) {
          cart.items[existingItemIndex].quantity = Number(item.quantity);
        }
      });

      let products = await Promise.all(
        cart.items.map(async (item) => {
          let product = await Product.findById(item.productId);
          return product;
        })
      );

      // if item out of stock
      for (let i = 0; i < products.length; i++) {
        if (products[i].quantity < cart.items[i].quantity) {
          return {
            success: false,
            message: `${products[i].productName} has only ${products[i].quantity} units are in stock.Please adjust your quantity`,
            product: products[i].productName,
          };
        }
      }

      // Save updated cart and discount
      await redisClient.set(`cart:${userId}`, JSON.stringify(cart));
      await redisClient.set(
        `couponDiscount:${userId}`,
        JSON.stringify(couponDiscount)
      );

      return { success: true, message: 'Cart updated' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

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
};

export { CartService };
