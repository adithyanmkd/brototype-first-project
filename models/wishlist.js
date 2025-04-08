import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
  ],
  addedAt: { type: Date, default: Date.now },
});

let Wishlist = mongoose.model('Wishlist', wishlistSchema);

// export model
export default Wishlist;
