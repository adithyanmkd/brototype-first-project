// import models
import { Category, Product } from '../../models/index.js';

const adminProductService = {
  addProduct: async ({
    productName,
    description,
    price,
    category,
    quantity,
    files,
  }) => {
    try {
      let product = await Product.findOne({
        productName: { $regex: `^${productName}$`, $options: 'i' },
      });

      //   console.log('product name: ', product);
      //   console.log('files: ', files);

      // if product already exists then return with message
      if (product) {
        return {
          success: false,
          message: 'Product already exists',
        };
      }

      console.log('Debug log: test', files['productImages']);

      files['productImages'].forEach((file, index) => {
        console.log('Debug log: ', file.path);
      });

      // create new product
      let newProduct = new Product({
        productName,
        description,
        price,
        category,
        quantity,
        images: {
          cardImage: {
            path: files['cardImage'][0].path.replace(/.*\/public\//, '/'),
            alt: `${productName} card image.`,
          },
          productImages: files['productImages'].map((file, index) => ({
            path: file.path.replace(/.*\/public\//, '/'),
            alt: `${productName} product image ${index + 1}`,
          })),
        },
      });

      // saving new product
      await newProduct.save();

      return {
        success: true,
        message: 'Successfully added new product',
        product: newProduct,
        redirect: '/admin/products',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Product adding failed.',
        error,
      };
    }
  },
};

export default adminProductService;
