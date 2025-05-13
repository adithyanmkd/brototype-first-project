import {
  createProductOffer as createProductOfferService,
  getAllProductOffers as getAllProductOffersService,
  updateProductOffer as updateProductOfferService,
  deleteProductOffer as deleteProductOfferService,
  createCategoryOffer as createCategoryOfferService,
  getAllCategoryOffers as getAllCategoryOffersService,
  updateCategoryOffer as updateCategoryOfferService,
  deleteCategoryOffer as deleteCategoryOfferService,
  getProductOfferById,
  getCategoryOfferById,
} from '../../services/admin/offerService.js';
import Product from '../../models/productModel.js';
import Category from '../../models/categoryModel.js';

// Create a product offer
export const createProductOffer = async (req, res) => {
  try {
    await createProductOfferService(req.body);
    return res.status(200).json({
      success: true,
      message: 'Prodout offer successfully created.',
    });
  } catch (error) {
    console.error('Error creating product offer:', error);
    res.status(400).send('Invalid Data');
  }
};

// Get all product offers
export const getAllProductOffers = async (req, res) => {
  try {
    const productOffers = await getAllProductOffersService();
    res.render('admin/pages/productOffer/list', {
      productOffers,
      layout: 'layouts/admin-layout.ejs',
    });
  } catch (error) {
    console.error('Error fetching product offers:', error);
    res.status(500).send('Server Error');
  }
};

// Update a product offer
export const updateProductOffer = async (req, res) => {
  try {
    // console.log('Content-Type:', req.headers['content-type']);
    // console.log('req.body:', req.body);
    const { id } = req.params;
    const updatedProductOffer = await updateProductOfferService(id, req.body);
    if (!updatedProductOffer) {
      return res.status(404).send('Product offer not found');
    }

    // console.log(req.body);
    return res.status(200).json({
      success: true,
      message: 'Prodout offer successfully updated.',
    });
  } catch (error) {
    console.error('Error updating product offer:', error);
    res.status(400).send('Invalid Data');
  }
};

// Delete a product offer
export const deleteProductOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductOffer = await deleteProductOfferService(id);
    if (!deletedProductOffer) {
      return res.status(404).send('Product offer not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Product offer successfully deleted.',
    });
  } catch (error) {
    console.error('Error deleting product offer:', error);
    res.status(500).send('Server Error');
  }
};

// Render product offer form
export const renderProductOfferForm = async (req, res) => {
  try {
    const offerId = req.params.id;
    const offer = offerId ? await getProductOfferById(offerId) : null; // Fetch the offer if editing
    const products = await Product.find(); // Fetch all products to populate the dropdown
    res.render('admin/pages/productOffer/form', {
      layout: 'layouts/admin-layout.ejs',
      offer,
      products, // Pass the products to the template
    });
  } catch (error) {
    console.error('Error rendering product offer form:', error);
    res.status(500).send('Server Error');
  }
};

// Create a category offer
export const createCategoryOffer = async (req, res) => {
  try {
    await createCategoryOfferService(req.body); // Create the category offer
    res.redirect('/admin/offers/category'); // Redirect to the category offers list page
  } catch (error) {
    console.error('Error creating category offer:', error);
    res.status(400).send('Invalid Data'); // Handle errors
  }
};

// Get all category offers
export const getAllCategoryOffers = async (req, res) => {
  try {
    const categoryOffers = await getAllCategoryOffersService();
    res.render('admin/pages/categoryOffer/list', {
      categoryOffers,
      layout: 'layouts/admin-layout.ejs',
    });
  } catch (error) {
    console.error('Error fetching category offers:', error);
    res.status(500).send('Server Error');
  }
};

// Update a category offer
export const updateCategoryOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategoryOffer = await updateCategoryOfferService(id, req.body);
    if (!updatedCategoryOffer) {
      return res.status(404).send('Category offer not found');
    }
    res.redirect('/admin/offers/category'); // Redirect to the category offer list page
  } catch (error) {
    console.error('Error updating category offer:', error);
    res.status(400).send('Invalid Data');
  }
};

// Delete a category offer
export const deleteCategoryOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategoryOffer = await deleteCategoryOfferService(id);
    if (!deletedCategoryOffer) {
      return res.status(404).send('Category offer not found');
    }
    res.redirect('/admin/offers/category'); // Redirect to the category offer list page
  } catch (error) {
    console.error('Error deleting category offer:', error);
    res.status(500).send('Server Error');
  }
};

// Render category offer form
export const renderCategoryOfferForm = async (req, res) => {
  try {
    const offerId = req.params.id;
    const offer = offerId ? await getCategoryOfferById(offerId) : null;
    const categories = await Category.find();
    console.log(categories);
    res.render('admin/pages/categoryOffer/form', {
      layout: 'layouts/admin-layout.ejs',
      offer,
      categories,
    });
  } catch (error) {
    console.error('Error rendering category offer form:', error);
    res.status(500).send('Server Error');
  }
};
