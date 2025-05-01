import { Address, Cart, Product, User, Wishlist } from '../../models/index.js';

// import utils
import getUserMenus from '../../utils/getSidebarMenus.js';

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

let addressController = {
  getAddress,
  postAddAddress,
  getAddressEdit,
  postEditAddress,
  postDeleteAddress,
};

export default addressController;
