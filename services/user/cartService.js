import redisClient from '../../config/redisConfig.js';

import { Product } from '../../models/index.js';

const CartService = {
  updateCart: async (userId, cartItems, couponDiscount) => {
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
          message: 'Item out stock',
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
  },
};

export { CartService };
