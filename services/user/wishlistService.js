import mongoose from 'mongoose';

// import models
import { Wishlist } from '../../models/index.js';

const wishlistService = {
  // get all wishlist item service
  getAllWishlistItemsService: async ({ userId }) => {
    try {
      let wishlist = await Wishlist.findOne({ userId });

      return wishlist.items;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // remove wishlist item
  removeWishlistItemService: async ({ userId, productId }) => {
    try {
      let productObjectId = new mongoose.Types.ObjectId(`${productId}`);

      let updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { items: { product: productObjectId } } },
        { new: true }
      );

      return updatedWishlist.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default wishlistService;
