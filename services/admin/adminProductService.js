import mongoose from 'mongoose';

// import models
import { Category, Product } from '../../models/index.js';

const adminProductService = {
  // add product service
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
        isDeleted: false,
      });

      // if product already exists then return with message
      if (product) {
        return {
          success: false,
          message: 'Product already exists',
        };
      }

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

  // edit product service
  editProduct: async ({
    id,
    productName,
    description,
    price,
    category,
    quantity,
    files,
    removeImgIds = [],
  }) => {
    try {
      let product = await Product.findOne({
        _id: id,
      });

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      // Check if another product with the same name exists
      let existingProduct = await Product.findOne({
        _id: { $ne: id },
        productName: { $regex: `^${productName}$`, $options: 'i' },
      });

      if (existingProduct) {
        return {
          success: false,
          message: 'Another product with this name already exists',
        };
      }

      product.productName = productName;
      product.description = description;
      product.price = price;
      product.category = category;
      product.quantity = quantity;

      // Remove cardImage if its ID is in removeImgIds
      if (
        product.images.cardImage &&
        removeImgIds.includes(String(product.images.cardImage._id))
      ) {
        product.images.cardImage = undefined;
      }

      // Filter out productImages whose _id is in removeImgIds
      product.images.productImages = product.images.productImages.filter(
        (img) => !removeImgIds.includes(String(img._id))
      );

      // Handle new uploads
      if (files?.cardImage?.length > 0) {
        product.images.cardImage = {
          path: files['cardImage'][0].path.replace(/.*\/public\//, '/'),
          alt: `${productName} card image.`,
        };
      }

      if (files?.productImages?.length > 0) {
        const newImages = files['productImages'].map((file, index) => ({
          path: file.path.replace(/.*\/public\//, '/'),
          alt: `${productName} product image ${index + 1}`,
        }));
        product.images.productImages.push(...newImages);
      }

      await product.save();

      return {
        success: true,
        message: 'Product updated successfully',
        product,
        redirect: '/admin/products',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Product updating failed.',
        error,
      };
    }
  },

  // get product details
  getProduct: async ({ id }) => {
    try {
      let productId = new mongoose.Types.ObjectId(`${id}`);

      let product = await Product.aggregate([
        { $match: { _id: productId } },
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

      // console.log(product, 'product log');

      return {
        success: true,
        message: 'Product fetched',
        product: product[0],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Something went wrong while product fetching.',
      };
    }
  },

  // list and unlist product
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

export default adminProductService;
