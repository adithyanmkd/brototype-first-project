import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    locality: { type: String },
    pincode: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    isDefault: { type: Boolean },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Address = new mongoose.model('Address', addressSchema);

export default Address;
