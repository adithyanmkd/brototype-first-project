// import packages
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// import models
import { Address, Cart, Product, User, Wishlist } from '../../models/index.js';

// import utils
import getUserMenus from '../../utils/getSidebarMenus.js';

// get user details page
const userDetails = (req, res) => {
  const user = req.session.user;

  let menus = getUserMenus(user); // fetching user menus

  res.render('user/pages/profile/userDetails', { user, menus });
};

// get edit profile page
const getEditProfile = (req, res) => {
  const user = req.session.user;
  let menus = getUserMenus(user); // fetching user menus

  res.render('user/pages/profile/editProfile', { user, menus });
};

// post edit profile page
const postEditProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number, gender } = req.body;

    const user = await User.find({ email });

    if (user.email) {
      return res.status(404).json({ error: 'User already exists!' });
    }

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        number,
        gender,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update session if needed
    req.session.user = updatedUser;

    // Redirect to the profile details page
    res.redirect('/account/my-details');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// get password change page
const getPasswordChange = (req, res) => {
  let user = req.session.user;

  let menus = getUserMenus(user); // fetching user menus

  res.render('user/pages/profile/changePassword', {
    layout: 'layouts/user-layout.ejs',
    menus,
  });
};

// post change password
const postChangePassword = async (req, res) => {
  const sessionUser = req.session.user;
  const dbUser = await User.findById(sessionUser._id);

  // accessing form values
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const isMatch = await bcrypt.compare(oldPassword, dbUser.password); // checking current password db password

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // password hashing
    dbUser.password = hashedPassword;
    dbUser.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error while changing password' });
  }
};

// show all address
const getAddress = async (req, res) => {
  let user = req.session.user;

  let addresses = await Address.find({ userId: user._id }); // finding user addresses

  let menus = getUserMenus(user); // fetching user menus

  res.render('user/pages/profile/address', {
    layout: 'layouts/user-layout.ejs',
    menus,
    addresses,
  });
};

// add address
const postAddAddress = async (req, res) => {
  let user = req.session.user;

  try {
    let newAddress = await Address({
      userId: user._id,
      ...req.body,
    });

    await newAddress.save();
  } catch (error) {
    console.log({ Error: error, message: 'error from profile controller' });
  }

  res.status(200).json({ user });
};

// edit address page
const getAddressEdit = async (req, res) => {
  let addressId = req.params.id;
  let address = await Address.findById(addressId);
  res.render('user/partials/organisms/editAddressModal.ejs', { address });
};

// edit address
const postEditAddress = async (req, res) => {
  let user = req.session.user;
  let { addressId, ...body } = req.body;

  try {
    let updateAddress = await Address.findByIdAndUpdate(
      { _id: addressId },
      { $set: { ...body } },
      { new: true }
    );
  } catch (error) {
    console.log({ Error: error, message: 'error from profile controller' });
  }

  res.status(200).json({ user });
};

// post delete address
const postDeleteAddress = async (req, res) => {
  let user = req.session.user;
  let addressId = req.params.id;

  try {
    let address = await Address.findByIdAndDelete(addressId);
    res.status(200).json({ message: 'Successfully deleted address' });
  } catch (error) {
    res.json({ Error: error, message: 'error while deleting address' });
  }
};

// get wishlist page
const getWishlist = async (req, res) => {
  const user = req.session.user;

  const wishlist = await Wishlist.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(`${user._id}`) },
    },
    {
      $unwind: '$items',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.productDetails',
      },
    },
    { $unwind: '$items.productDetails' },
    {
      $group: {
        _id: '$_id',
        userId: { $first: '$userId' },
        addedAt: { $first: '$addedAt' },
        items: {
          $push: {
            productId: '$items.product',
            addedAt: '$addedAt',
            productDetails: '$items.productDetails',
          },
        },
      },
    },
  ]);

  let menus = getUserMenus(user); // fetching user menus

  if (!wishlist[0]) {
    return res.render('user/pages/profile/emptyWishlist', {
      user,
      menus,
    });
  }

  res.render('user/pages/profile/wishlist.ejs', {
    user,
    menus,
    wishlist: wishlist[0],
  });
};

// add wishlist
const postWishlist = async (req, res) => {
  const user = req.session.user;
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId: user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: user._id,
        items: [
          {
            product: productId,
          },
        ],
      });
    } else {
      const alreadyExists = wishlist.items.some(
        (item) => item.product.toString() === productId
      );

      // if product not it wishlist push the new produt into wishlist
      if (!alreadyExists) {
        wishlist.items.push({ product: productId });
      } else {
        return res.status(400).json({
          success: false,
          message: 'product already added in wishlist',
        });
      }
    }

    await wishlist.save(); // saving new wishlist item
    res
      .status(200)
      .json({ success: true, message: 'Successfully added in wishlist' });
  } catch (error) {
    console.error({ Error: error });
    res.status(500).status({
      success: false,
      message: 'wishlist item adding failed',
      error,
    });
  }
};

// delete wishlist item
const deleteWishlist = async (req, res) => {
  let user = req.session.user;
  let productId = req.params.productId;

  try {
    await Wishlist.updateOne(
      { userId: new mongoose.Types.ObjectId(`${user._id}`) },
      {
        $pull: {
          items: { product: new mongoose.Types.ObjectId(`${productId}`) },
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: 'item deleted successfully' });
  } catch (error) {
    console.error({ Error: error });
  }
};

export const getReferralLink = async (req, res) => {
  const user = req.user;

  let menus = getUserMenus(user); // fetching user menus

  try {
    if (!user || !user.referralCode) {
      return res.status(404).json({ error: 'Referral code not found' });
    }

    // Generate the referral link
    const referralLink = `${req.protocol}://${req.get('host')}/register?referralCode=${user.referralCode}`;

    // Render the referral page with the referral link
    res.render('user/pages/profile/referral', {
      layout: 'layouts/user-layout',
      title: 'Referral Program',
      referralLink,
      referralCode: user.referralCode,
      menus,
      successMessage: null,
      errorMessage: null,
    });
  } catch (error) {
    console.error('Error generating referral link:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

import { walletService } from '../../services/user/walletService.js';

export const applyReferralCode = async (req, res) => {
  let user = req.user;
  let menus = getUserMenus(user); // fetching user menus

  try {
    const { referralCode } = req.body;
    const userId = req.user._id;

    // Check if the referral code exists
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.render('user/pages/profile/referral', {
        layout: 'layouts/user-layout',
        menus,
        referralLink,
        referralCode: user.referralCode,
        successMessage: null,
        errorMessage: 'Invalid referral code',
      });
    }
    // Check if the user has already applied a referral code
    const user = await User.findById(userId);

    // Generate the referral link
    const referralLink = `${req.protocol}://${req.get('host')}/register?referralCode=${user.referralCode}`;

    if (user.referredBy) {
      return res.render('user/pages/profile/referral', {
        layout: 'layouts/user-layout',
        menus,
        referralLink,
        referralCode: user.referralCode,
        successMessage: null,
        errorMessage: 'You have already applied a referral code',
      });
    }

    // Apply the referral code
    user.referredBy = referralCode;

    // Reward both users
    const rewardAmount = 100; // Example reward amount

    // Add money to the referrer's wallet
    await walletService.topup({
      userId: referrer._id,
      paymentId: `REFERRAL_${userId}_${Date.now()}`, // Unique transaction ID
      orderId: null, // No order associated with this transaction
      signature: null, // No signature required for referral rewards
      amount: rewardAmount,
    });

    // Add money to the referred user's wallet
    await walletService.topup({
      userId: userId,
      paymentId: `REFERRAL_${referrer._id}_${Date.now()}`, // Unique transaction ID
      orderId: null, // No order associated with this transaction
      signature: null, // No signature required for referral rewards
      amount: rewardAmount,
    });

    // Save the updates
    await user.save();

    res.render('user/pages/profile/referral', {
      layout: 'layouts/user-layout',
      menus,
      successMessage:
        'Referral code applied successfully! Rewards have been added to your wallet.',
      referralLink: `${req.protocol}://${req.get('host')}/register?referralCode=${user.referralCode}`,
      referralCode: user.referralCode,
      errorMessage: null,
    });
  } catch (error) {
    console.error('Error applying referral code:', error);
    res.render('user/pages/profile/referral', {
      layout: 'layouts/user-layout',
      menus,
      successMessage: null,
      errorMessage: 'Server Error. Please try again later.',
    });
  }
};

// export profile controller
const profileController = {
  userDetails,
  getEditProfile,
  postEditProfile,
  getPasswordChange,
  postChangePassword,
  getAddress,
  postAddAddress,
  postEditAddress,
  getAddressEdit,
  postDeleteAddress,
  getWishlist,
  postWishlist,
  deleteWishlist,
  getReferralLink,
  applyReferralCode,
};

export default profileController;
