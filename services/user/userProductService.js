import mongoose from 'mongoose';

// import models
import { Product } from '../../models/index.js';

const userProductServices = {
  // get product details
  getProduct: async ({ productId }) => {
    try {
      let id = new mongoose.Types.ObjectId(`${productId}`);

      // let product = await Product.findById(id);

      let product = await Product.aggregate([
        { $match: { _id: id } },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
      ]);

      console.log(id, 'id log');

      console.log(product[0], 'user product log');

      return product[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default userProductServices;
