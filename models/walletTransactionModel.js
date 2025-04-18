import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  thumbnail: String,
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  transactionNote: String,
  // orderId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Order',
  //   required: null,
  // },
  orderId: String,
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const WalletTransaction = mongoose.model(
  'WalletTransaction',
  transactionSchema
);

export default WalletTransaction;
