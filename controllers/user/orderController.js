import menus from '../../datasets/profileMenus.js';

// get all orders
const getAllOrders = (req, res) => {
  let userMenus = [...menus];
  let user = req.session.user;

  // google user no need of password change
  if (!user.isGoogleUser) {
    userMenus.splice(1, 0, {
      name: 'Password',
      href: '/account/change-password',
    });
  }

  res.render('user/pages/order/orders.ejs', { menus: userMenus });
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

const orderController = {
  getAllOrders,
  placeOrder,
};

export default orderController;
