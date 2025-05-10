import mongoose from 'mongoose';

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
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    orderThumbnail: {
      type: String,
    },
    productName: {
      type: String,
    },
    couponCode: { type: String, default: null },
    discountAmount: Number,
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'wallet', 'razorpay'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Return Requested',
        'Return Rejected',
        'Returned',
        'Order Failed',
      ],
      default: 'Pending',
    },
    returnReason: String,
    cancelReason: String,
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
    expectedDeliveryDate: {
      type: Date,
      default: () => {
        const delivery = new Date();
        delivery.setDate(delivery.getDate() + 7); // 7 days from order
        return delivery;
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
