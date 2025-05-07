// import models
import { Product } from '../../models/index.js';

const productService = {
  toggleProductStatus: async ({ productId }) => {
    try {
      const product = await Product.findOne({ _id: productId });
      product.isListed = !product.isListed;
      await product.save();
      return {
        message: `Product has been ${product.isListed ? 'listed' : 'unlisted'}`,
        isListed: product.isListed,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
};

export default productService;
