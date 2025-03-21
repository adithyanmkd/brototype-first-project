import mongoose, { mongo } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String }, // store google user ID
    name: { type: String },
    email: {
      type: String,
      required: true,
      urique: true,
    },
    password: {
      type: String, // optional for google user
    },
    number: { type: Number },
    gender: { type: String },
    role: {
      type: String,
      enum: ['customer', 'admin'], // allowed roles
      default: 'customer', // default role for new customer
    },
    isBlocked: { type: Boolean, default: false },
    isGoogleUser: { type: Boolean, default: false },
    profilePic: { type: String, default: '/images/icons/avatar.svg' }, // google profile pic
    otp: { type: String }, // OTP for email validation
    otpExpires: { type: Date }, // Expiration time for OTP
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const User = mongoose.model('User', userSchema);

// export User model
export default User;
