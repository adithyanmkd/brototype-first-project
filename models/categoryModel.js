import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      path: {
        type: String,
        required: true,
      },
      alt: { type: String, default: 'category image' },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Category = mongoose.model('Category', categorySchema);

// export model
export default Category;
