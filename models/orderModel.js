import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderedItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment'],
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
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
