// imoprt models
import { Cart, Product } from '../../models/index.js';

// get cart page
const getCart = async (req, res) => {
  let user = req.session.user;
  let userCart = await Cart.findOne({ userId: user._id });

  if (!userCart) {
    return res.render('user/pages/cart/cart.ejs', {
      cartItems: [],
      totalCount: 0,
    });
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

  // calcalated prices
  let totalSellingPrice = 0;
  let totalOriginalPrice = 0;

  let totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // calculating total quantity

  cartItems.forEach((item) => {
    totalSellingPrice += item._doc.price.sellingPrice;
    totalOriginalPrice += item._doc.price.originalPrice;
  });

  console.log(cartItems);

  res.render('user/pages/cart/cart.ejs', {
    cartItems,
    totalItems,
    totalSellingPrice,
    totalOriginalPrice,
  });
};

// adding cart item into user
const addToCart = async (req, res) => {
  let userId = req.session.user._id;
  let { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId }); // checking cart already exist

  // if cart is not exist
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // find() returns a reference to the found object
  let existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  try {
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save(); // save item
    res.json({ success: true, message: 'Item added succesfully' });
  } catch (error) {
    console.log({
      Error: error,
      message: 'Error while adding product to cart',
    });
  }
};

const cartController = {
  getCart,
  addToCart,
};

export default cartController;
