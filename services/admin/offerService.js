import ProductOffer from '../../models/productOfferModel.js';
import CategoryOffer from '../../models/categoryOfferModel.js';

// Product Offer Services
export const createProductOffer = async (productOfferData) => {
  return await ProductOffer.create(productOfferData);
};

export const getAllProductOffers = async () => {
  let productOffer = await ProductOffer.find().populate('productId');
  return await ProductOffer.find().populate('productId');
};

export const updateProductOffer = async (id, updateData) => {
  return await ProductOffer.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProductOffer = async (id) => {
  return await ProductOffer.findByIdAndDelete(id);
};

export const getProductOfferById = async (id) => {
  try {
    return await ProductOffer.findById(id).populate('productId'); // Populate product details
  } catch (error) {
    console.error('Error fetching product offer by ID:', error);
    throw error;
  }
};

export const getProductOfferByProductId = async (productId) => {
  try {
    // Fetch the active product offer for the given product ID
    return await ProductOffer.findOne({
      productId,
      endDate: { $gte: new Date() },
    });
  } catch (error) {
    console.error('Error fetching product offer:', error);
    throw error;
  }
};

// Category Offer Services
export const createCategoryOffer = async (categoryOfferData) => {
  return await CategoryOffer.create(categoryOfferData);
};

export const getAllCategoryOffers = async () => {
  return await CategoryOffer.find().populate('categoryId'); // Populate category details
};

export const updateCategoryOffer = async (id, updateData) => {
  return await CategoryOffer.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCategoryOffer = async (id) => {
  return await CategoryOffer.findByIdAndDelete(id);
};

export const getCategoryOfferById = async (id) => {
  try {
    return await CategoryOffer.findById(id).populate('categoryId'); // Populate category details
  } catch (error) {
    console.error('Error fetching category offer by ID:', error);
    throw error;
  }
};

export const getCategoryOfferByCategoryId = async (categoryId) => {
  try {
    return await CategoryOffer.findOne({
      categoryId,
      endDate: { $gte: new Date() },
    });
  } catch (error) {
    console.error('Error fetching category offer:', error);
    throw error;
  }
};
