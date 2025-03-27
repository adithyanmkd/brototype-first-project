import menus from '../../datasets/profileMenus.js';
import Order from '../../models/orderModel.js';

// get all orders
const getAllOrders = async (req, res) => {
  let userMenus = [...menus];
  let user = req.session.user;

  let orders = await Order.find();

  if (!user) {
    return res.redirect('/auth/login');
  }

  // google user no need of password change
  if (!user.isGoogleUser) {
    userMenus.splice(1, 0, {
      name: 'Password',
      href: '/account/change-password',
    });
  }

  res.render('user/pages/order/orders.ejs', {
    menus: userMenus,
    orders,
  });
};

// get single order details page
const getOrder = async (req, res) => {
  let id = req.params.orderId; // accessing id from query params
  let order = await Order.findById(id).populate(
    'userId',
    'email name profilePic number'
  );

  // calculate total items
  let totalItems = order.orderedItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  ); // calculating total quantity

  res.render('user/pages/order/orderDetails.ejs', {
    layout: 'layouts/user-layout.ejs',
    order,
    totalItems,
  });
};

// Place an order
const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      orderedItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    } = req.body;

    if (!userId || !orderedItems.length || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }

    const newOrder = new Order({
      userId,
      orderedItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    });

    await newOrder.save();

    // Add the order reference to the user
    await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

    res
      .status(201)
      .json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

const ordersController = {
  getAllOrders,
  getOrder,
  placeOrder,
};

export default ordersController;
