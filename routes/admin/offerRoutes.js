import express from 'express';
import {
  createProductOffer,
  getAllProductOffers,
  updateProductOffer,
  deleteProductOffer,
  createCategoryOffer,
  getAllCategoryOffers,
  updateCategoryOffer,
  deleteCategoryOffer,
  renderProductOfferForm,
  renderCategoryOfferForm,
} from '../../controllers/admin/offerController.js';

const router = express.Router();

// Routes for product offers
router.get('/product/create', renderProductOfferForm); // Render form for creating a product offer
router.get('/product/edit/:id', renderProductOfferForm); // Render form for editing a product offer
router.post('/product', createProductOffer); // Create a product offer
router.get('/product', getAllProductOffers); // Get all product offers
router.post('/product/edit/:id', updateProductOffer); // Update a product offer (changed from PUT to POST)
router.post('/product/delete/:id', deleteProductOffer); // Delete a product offer (changed from DELETE to POST)

// Routes for category offers
router.get('/category/create', renderCategoryOfferForm); // Render form for creating a category offer
router.get('/category/edit/:id', renderCategoryOfferForm); // Render form for editing a category offer
router.post('/category', createCategoryOffer); // Create a category offer
router.get('/category', getAllCategoryOffers); // Get all category offers
router.post('/category/edit/:id', updateCategoryOffer); // Update a category offer (changed from PUT to POST)
router.post('/category/delete/:id', deleteCategoryOffer); // Delete a category offer (changed from DELETE to POST)

export default router;
