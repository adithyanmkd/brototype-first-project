// import models
import { Product, Category } from '../../models/index.js';

const salesService = {
  updateSalesCounts: async ({ orderedItems }) => {
    try {
      for (let item of orderedItems) {
        let { productId, quantity } = item;

        let product = await Product.findById(productId);
        product.salesCount += quantity; // increasing product sales count
        product.save();

        let categoryId = product.category;
        let category = await Category.findById(categoryId);
        category.salesCount += quantity;
        category.save();
      }
      return {
        success: true,
        message: 'Sales count updated',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Sales count update failed',
        error,
      };
    }
  },

  // get top 10 product
  getTop10Products: async () => {
    try {
      let top10Products = await Product.find({ salesCount: { $gt: 0 } })
        .sort({ salesCount: -1 })
        .limit(10)
        .populate('category', 'name');
      return {
        success: true,
        message: 'fetched top 10 products',
        top10Products,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'top 10 product fetching failed',
        error,
      };
    }
  },

  // get top 10 category
  getTop10Category: async () => {
    try {
      let top10Category = await Category.find({ salesCount: { $gt: 0 } })
        .sort({ salesCount: -1 })
        .limit(10);

      return {
        success: true,
        message: 'top 10 category fetched successfully',
        top10Category,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'top 10 category fetching failed!',
        error,
      };
    }
  },
};

export default salesService;
