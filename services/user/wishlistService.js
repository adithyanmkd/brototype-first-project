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
};

export default wishlistService;
