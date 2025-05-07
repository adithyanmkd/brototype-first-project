import Category from '../../models/categoryModel.js';
import Product from '../../models/productModel.js';
import Wishlist from '../../models/wishlistModel.js';
import {
  getProductOfferByProductId,
  getCategoryOfferByCategoryId,
} from '../../services/admin/offerService.js'; // Import the services to fetch offers

// get all products
const products = async (req, res) => {
  let user = req.session.user;

  try {
    let wishlistIds = [];

    let { category, sort, page } = req.query;
    let limit = 6; // Number of products per page
    let currentPage = parseInt(page) || 1;
    let skip = (currentPage - 1) * limit;

    // Filtering Logic
    let query = {};
    if (category && category !== 'all') {
      query.category = category; // Apply category filter
    }

    // Sorting Logic
    let sortQuery = {};
    if (sort) {
      if (sort === 'priceLow') sortQuery['price.sellingPrice'] = 1; // Low to High
      if (sort === 'priceHigh') sortQuery['price.sellingPrice'] = -1; // High to Low
      if (sort === 'nameAsc') sortQuery['productName'] = 1; // A to Z
      if (sort === 'nameDesc') sortQuery['productName'] = -1; // Z to A
      if (sort === 'discountHigh') sortQuery['price.discount'] = -1; // Highest Discount
    }

    // Get Total Count of Products (After Filtering)
    let totalProducts = await Product.countDocuments({
      ...query,
      isListed: false,
    });
    let totalPages = Math.ceil(totalProducts / limit);

    // Fetch Filtered & Sorted Products
    let products = await Product.find({ ...query, isListed: false })
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    let categories = await Category.find({ isListed: false });

    if (user) {
      const wishlist = await Wishlist.findOne({ userId: user._id }).lean();

      wishlistIds = wishlist ? wishlist.items.map((item) => item.product) : [];
    }

    res.render('user/pages/products/products', {
      products,
      category,
      categories,
      sort,
      currentPage,
      totalPages,
      wishlistIds,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
};

// get product (single product)
const productDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Fetch the product offer
    const productOffer = await getProductOfferByProductId(req.params.id);

    // Fetch the category offer
    const categoryOffer = await getCategoryOfferByCategoryId(product.category);

    // Determine the best offer
    let bestOffer = null;
    if (productOffer && categoryOffer) {
      bestOffer =
        productOffer.discountPercentage > categoryOffer.discountPercentage
          ? productOffer
          : categoryOffer;
    } else if (productOffer) {
      bestOffer = productOffer;
    } else if (categoryOffer) {
      bestOffer = categoryOffer;
    }

    // Render the product details page with the product and offer data
    res.render('user/pages/products/productDetails', {
      product,
      productOffer,
      categoryOffer,
      bestOffer, // Pass the best offer to the template
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send('Server Error');
  }
};

// Individual Category Pages (Optional)
const mattress = async (req, res) => {
  res.render('user/pages/products/Mattress');
};

const pillows = (req, res) => {
  res.render('user/pages/Pillows');
};

// Export Updated Product Controller
const productController = {
  mattress,
  pillows,
  products,
  productDetails,
};

export default productController;
