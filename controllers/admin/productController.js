// import models
import Category from '../../models/categoryModel.js';
import Product from '../../models/productModel.js';

// import service
import adminProductService from '../../services/admin/adminProductService.js';
import productService from '../../services/admin/productService.js';

// get add product page
const getProduct = async (req, res) => {
  const categories = await Category.find({ isDeleted: false });
  res.render('admin/pages/products/addProduct.ejs', {
    layout: 'layouts/admin-layout',
    categories,
  });
};

// add product
const postProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      sellingPrice,
      originalPrice,
      category,
      quantity,
    } = req.body;

    // building product data for service
    let productData = {
      productName,
      description,
      price: {
        sellingPrice: Number(sellingPrice),
        originalPrice: Number(originalPrice),
      },
      category,
      quantity: Number(quantity),
    };

    let files = req.files;

    let serviceResponse = await adminProductService.addProduct({
      ...productData,
      files,
    });

    // if failed
    if (!serviceResponse.success) {
      return res.status(500).json(serviceResponse);
    }

    return res.status(200).json(serviceResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Adding product failed',
      error,
    });
  }
};

// list all products
const allProduct = async (req, res) => {
  let searchValue = req.query.search || ''; // accessing search value from url

  const page = parseInt(req.query.page) || 1;
  const limit = 4; // Number of users per page
  const skip = (page - 1) * limit;

  // Build the search filter
  let filter = {};
  if (searchValue) {
    filter = {
      $or: [{ productName: { $regex: searchValue, $options: 'i' } }],
    };
  }

  // Count total matching users
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch filtered and paginated product
  const products = await Product.find({ ...filter })
    .populate('category', 'name')
    .skip(skip)
    .limit(limit);

  console.log('products log: ', products);
  if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
    // If the request is AJAX or accepts JSON (like axios)
    res.status(200).json({ success: true, products });
  } else {
    // Normal page render
    res.render('admin/pages/products/listProducts.ejs', {
      products,
      page,
      totalPages,
      layout: 'layouts/admin-layout',
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    product.isListed = true;
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    res.json({
      Error: error,
      DeveloperNote: 'error from delete product controller',
    });
  }
};

// get edit page
const getEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await Category.find({ isDeleted: false });
    const product = await Product.findById(id);
    // console.log('Product Log: ', product);

    return res.render('admin/pages/products/editPage', {
      categories,
      product,
      layout: 'layouts/admin-layout',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Get edit page error',
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  // console.log('req body log:', req.body);

  try {
    const {
      productName,
      description,
      sellingPrice,
      originalPrice,
      category,
      quantity,
      removedImageIds = [], // destructure from req.body
    } = req.body;

    // Ensure removedImageIds is an array (in case it comes as string)
    const removeImgIds = Array.isArray(removedImageIds)
      ? removedImageIds
      : [removedImageIds];

    // Build product data for service
    let productData = {
      productName,
      description,
      price: {
        sellingPrice: Number(sellingPrice),
        originalPrice: Number(originalPrice),
      },
      category,
      quantity: Number(quantity),
    };

    let files = req.files;

    let serviceResponse = await adminProductService.editProduct({
      id: productId,
      ...productData,
      files,
      removeImgIds,
    });

    // If failed
    if (!serviceResponse.success) {
      return res.status(500).json(serviceResponse);
    }

    return res.status(200).json(serviceResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'update product failed',
      error,
    });
  }
};

const getProductDetails = async (req, res) => {
  let productId = req.params.id;

  try {
    let result = await adminProductService.getProduct({
      id: productId,
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    console.log('Response Log: ', result);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

// toggle product listing status
const toggleProductListing = async (req, res) => {
  try {
    const productId = req.params.id;
    const serviceResponse = await productService.toggleProductStatus({
      productId,
    });

    console.log('Service response log', serviceResponse);
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while toggle product listing',
    });
  }
};

const productController = {
  getProduct,
  postProduct,
  allProduct,
  deleteProduct,
  toggleProductListing,
  getEdit,
  updateProduct,
  getProductDetails,
};

// export product controller
export default productController;
