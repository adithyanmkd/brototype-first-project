// imoprt models
import { Cart, Product, Address, Coupon } from '../../models/index.js';

// import config
import redisClient from '../../config/redisConfig.js';

// import services
import { CartService } from '../../services/user/cartService.js';
import productServices from '../../services/user/productService.js';
import wishlistService from '../../services/user/wishlistService.js';

const getEmptyCart = async (req, res) => {
  let user = req.session.user;
  let couponDiscount = await redisClient.get(`couponDiscount:${user._id}`);

  if (couponDiscount) {
    await redisClient.del(`couponDiscount:${user._id}`);
  }

  res.render('user/pages/cart/emptyCart.ejs');
};

// get cart page
const getCart = async (req, res) => {
  let user = req.session.user;

  if (!user) {
    return res.render('user/pages/cart/emptyCart.ejs');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // sets time to 00:00:00

  const availableCoupons = await Coupon.find({
    isActive: true,
    endDate: { $gte: today },
  }).lean();

  // let userCart = await Cart.findOne({ userId: user._id });
  const cartData = await redisClient.get(`cart:${user._id}`);
  let userCart = JSON.parse(cartData);

  // calcalated prices
  let totalSellingPrice = 0;
  let totalOriginalPrice = 0;

  if (!userCart?.items.length > 0) {
    return res.render('user/pages/cart/emptyCart.ejs');
  }

  let cartItems = await Promise.all(
    userCart.items.map(async (item) => {
      let product = await Product.findById(item.productId).populate(
        'category',
        'name'
      );

      return {
        ...product,
        quantity: item.quantity,
      };
    })
  );

  let totalItems = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  ); // calculating total quantity

  cartItems.forEach((item) => {
    totalSellingPrice += item._doc.price.sellingPrice * item.quantity;
    totalOriginalPrice += item._doc.price.originalPrice * item.quantity;
  });

  let couponDiscount = await redisClient.get(`couponDiscount:${user._id}`);
  // totalSellingPrice - Number(JSON.parse(couponDiscount)) || 0,

  res.render('user/pages/cart/cart.ejs', {
    cartItems,
    totalItems,
    totalSellingPrice,
    totalOriginalPrice,
    availableCoupons,
    couponDiscount,
  });
};

// adding cart item into user
const addToCart = async (req, res) => {
  try {
    let user = req.session.user;
    let userId = user._id;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    let { productId, quantity } = req.body;

    let cart = await redisClient.get(`cart:${user._id}`);
    cart = cart ? JSON.parse(cart) : { items: [] };

    // checking item already exist
    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );

    let product = await Product.findById(productId);

    // product stock checking condition
    if (quantity > product.quantity) {
      return res
        .status(404)
        .json({ success: false, message: 'Product is out of stock' });
    }

    // remove the current item
    let updatedWishlist = await wishlistService.removeWishlistItemService({
      userId,
      productId,
    });

    // max product purchase limit condition
    if (cart.quantity >= 3) {
      return res
        .status(404)
        .json({ success: false, message: 'Max product purchase reached' });
    }

    // if product already exist increase qty
    if (itemIndex !== -1) {
      let itemQty = cart.items[itemIndex].quantity;

      if (itemQty >= 3) {
        return res.status(500).json({
          success: false,
          message: 'Max product purchase reached',
        });
      }
      cart.items[itemIndex].quantity =
        Number(cart.items[itemIndex].quantity) + Number(quantity);

      // console.log(itemQty, 'item qty log ========>>>>>>>><<<<<<<<<<<');

      if (itemQty >= product.quantity) {
        return res.status(500).json({
          success: false,
          message: 'Currently available stock already in you cart!!',
        });
      }
    } else {
      cart.items.push({ productId, quantity });
    }

    // store updated cart in Redis
    await redisClient.set(`cart:${user._id}`, JSON.stringify(cart));

    res.json({ success: true, message: 'Item moved succesfully', cart });
  } catch (error) {
    console.log({
      Error: error,
      message: 'Error while adding product to cart',
    });
    res.status(501).status({
      success: false,
      message: 'Error while adding product to cart',
    });
  }
};

// delete cart item
const deleteItem = async (req, res) => {
  let user = req.session.user;
  let { productId } = req.body;

  // let cart = await Cart.findOne({ userId: user._id });

  let userCart = await redisClient.get(`cart:${user._id}`);
  let cart = JSON.parse(userCart);

  try {
    cart.items = cart.items.filter((item) => productId !== item.productId);
    // await cart.save();

    // saving updated cart
    await redisClient.set(`cart:${user._id}`, JSON.stringify(cart));

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

// cart item proceeding
const postCart = async (req, res) => {
  let user = req.session.user;
  let { cartItems, couponDiscount } = req.body;

  try {
    let result = await CartService.updateCart(
      user._id,
      cartItems,
      couponDiscount
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({ success: true, message: 'cart post' });
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .json({ success: false, message: 'Error while posting cart items' });
  }
};

const cartController = {
  getCart,
  addToCart,
  deleteItem,
  postCart,
  getEmptyCart,
};

export default cartController;
