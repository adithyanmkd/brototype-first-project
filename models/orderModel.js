import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

function generateOrderId() {
  const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
  const randomDigits = Math.floor(
    10000000 + Math.random() * 90000000
  ).toString(); // 7 random digits
  return timestamp + randomDigits.slice(0, 6); // Ensure it's exactly 14 digits
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: generateOrderId, // generating unique order id
    },
    orderedItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: String,
        thumbnail: String,
        quantity: Number,
        price: Number,
      },
    ],
    orderThumbnail: {
      type: String,
    },
    productName: {
      type: String,
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'wallet', 'razorpay'],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveryAddress: {
      name: String,
      phone: String,
      address: String,
      locality: String,
      district: String,
      state: String,
      pincode: String,
    },
    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
