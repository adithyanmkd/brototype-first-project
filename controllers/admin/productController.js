// import models
import Category from '../../models/categoryModel.js';
import Product from '../../models/productModel.js';
import adminProductService from '../../services/admin/adminProductService.js';

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
  const limit = 3; // Number of users per page
  const skip = (page - 1) * limit;

  // Build the search filter
  let filter = {};
  if (searchValue) {
    filter = {
      $or: [{ productName: { $regex: searchValue, $options: 'i' } }],
    };
  }

  // Count total matching users
  const totalProducts = await Product.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch filtered and paginated product
  const products = await Product.find({ ...filter, isDeleted: false })
    .populate('category', 'name')
    .skip(skip)
    .limit(limit);

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
    product.isDeleted = true;
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
  const id = req.params.id;
  const categories = await Category.find({ isDeleted: false });
  const product = await Product.findById(id);
  console.log(categories);
  res.render('admin/pages/products/editPage', {
    categories,
    product,
    layout: 'layouts/admin-layout',
  });
};

// Update product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  const files = req.files;

  try {
    // Convert price values to numbers
    const sellingPrice = parseFloat(updates.price.sellingPrice) || 0;
    const originalPrice = parseFloat(updates.price.originalPrice) || 0;

    // Prepare update object
    const updateData = {
      productName: updates.productName,
      description: updates.description,
      price: {
        sellingPrice,
        originalPrice,
      },
      category: updates.category,
      quantity: updates.quantity,
      sizeCategory: updates.sizeCategory,
    };

    // Handle card image update
    if (files?.cardImage) {
      updateData.images = {
        cardImage: {
          path: files.cardImage[0].path.replace(/.*\/public\//, '/'),
          alt: `${updates.productName} card image`,
        },
        productImages: updates.images?.productImages || [],
      };
    }

    // Handle product images update
    if (files?.productImages) {
      const newProductImages = files.productImages.map((file, index) => ({
        path: file.path.replace(/.*\/public\//, '/'),
        alt: `${updates.productName} product image ${index + 1}`,
      }));

      updateData.images = {
        ...updateData.images,
        productImages: [
          ...(updateData.images?.productImages || []),
          ...newProductImages,
        ],
      };
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      error: 'Failed to update product',
      DeveloperNote: 'Error from updateProduct controller',
    });
  }
};

const productController = {
  getProduct,
  postProduct,
  allProduct,
  deleteProduct,
  getEdit,
  updateProduct,
};

// export product controller
export default productController;
