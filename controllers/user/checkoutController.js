import { Cart, Product, Address } from '../../models/index.js';

// get checkout page
let getCheckout = async (req, res) => {
  let user = req.session.user;
  let userCart = await Cart.findOne({ userId: user._id });
  let addresses = await Address.find({ userId: user._id }); // finding user addresses

  // calcalated prices
  let totalSellingPrice = 0;
  let totalOriginalPrice = 0;

  if (!userCart) {
    return res.render('user/pages/cart/emptyCart.ejs');
  }

  let cartItems = await Promise.all(
    userCart.items.map(async (item) => {
      let product = await Product.findById(item.productId);

      return {
        ...product,
        quantity: item.quantity,
      };
    })
  );

  let totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // calculating total quantity

  cartItems.forEach((item) => {
    totalSellingPrice += item._doc.price.sellingPrice * item.quantity;
    totalOriginalPrice += item._doc.price.originalPrice * item.quantity;
  });

  res.render('user/pages/checkout/checkout.ejs', {
    totalItems,
    totalSellingPrice,
    totalOriginalPrice,
    addresses,
  });
};

// post checkout page
let postCheckout = async (req, res) => {
  let user = req.session.user;
  let cartItems = req.session.cartItems;

  req.session.addressId = req.body;
  res.json(req.body);
};

const checkoutController = {
  getCheckout,
  postCheckout,
};

export default checkoutController;
