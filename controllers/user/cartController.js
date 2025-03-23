// imoprt models
import { Cart, Product, Address } from '../../models/index.js';

const getEmptyCart = (req, res) => {
  res.render('user/pages/cart/emptyCart.ejs');
};

// get cart page
const getCart = async (req, res) => {
  let user = req.session.user;

  if (!user) {
    return res.render('user/pages/cart/emptyCart.ejs');
  }

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

  res.render('user/pages/cart/cart.ejs', {
    cartItems,
    totalItems,
    totalSellingPrice,
    totalOriginalPrice,
  });
};

// adding cart item into user
const addToCart = async (req, res) => {
  let user = req.session.user;

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  let { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId: user._id }); // checking cart already exist

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

const deleteItem = async (req, res) => {
  let userId = req.session.user;
  let { productId } = req.body;

  let cart = await Cart.findOne({ userId });

  try {
    cart.items = cart.items.filter(
      (item) => productId !== item.productId.toString()
    );
    await cart.save();
    if (cart.items.length > 0) {
      res
        .status(200)
        .json({ success: true, message: 'Cart item delete successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Cart is empty' });
    }
  } catch (error) {
    console.log({ Error: error, message: 'Error in cart delete controller' });
  }
};

const postCart = async (req, res) => {
  req.session.cartItems = req.body.cartItems;
  res.status(200).json('success');
};

const cartController = {
  getCart,
  addToCart,
  deleteItem,
  postCart,
  getEmptyCart,
};

export default cartController;
