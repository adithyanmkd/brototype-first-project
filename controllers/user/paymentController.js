import { Cart, Product } from '../../models/index.js';

// get payment page
const getPayment = async (req, res) => {
  let user = req.session.user;
  let userCart = await Cart.findOne({ userId: user._id });

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

  res.render('user/pages/payment/payment.ejs', {
    totalItems,
    totalSellingPrice,
    totalOriginalPrice,
  });
};

// get success page
const successPage = (req, res) => {
  res.render('user/pages/payment/success.ejs');
};

const paymentController = {
  getPayment,
  successPage,
};

export default paymentController;
