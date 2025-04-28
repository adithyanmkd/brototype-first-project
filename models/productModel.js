import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    images: {
      cardImage: {
        path: { type: String, required: true },
        alt: { type: String, required: true },
      },
      productImages: [
        {
          path: { type: String, required: true },
          alt: { type: String, required: true },
        },
      ],
    },
    description: { type: String, required: true },
    price: {
      sellingPrice: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
    salesCount: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    }, // Reference to Category model
    sizeCategory: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Product = mongoose.model('Product', productSchema);

// export model
export default Product;
