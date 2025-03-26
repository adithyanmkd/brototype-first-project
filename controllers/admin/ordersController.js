import { Order } from '../../models/index.js';

// get all orders list page
const getOrders = async (req, res) => {
  try {
    let orders = await Order.find().populate('userId', 'name email profilePic');
    res.render('admin/pages/orders/orders.ejs', {
      layout: 'layouts/admin-layout.ejs',
      orders,
    });
  } catch (error) {
    console.error({ Error: 'error from orders listing page' });
  }
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

  res.render('admin/pages/orders/orderDetails.ejs', {
    layout: 'layouts/admin-layout.ejs',
    order,
    totalItems,
  });
};

// update payment status
const updateOrderStatus = async (req, res) => {
  let { btnName, orderId } = req.body;

  try {
    let order = await Order.findById(orderId);
    order.orderStatus = btnName;
    await order.save();
    res.status(200).json({
      success: true,
      message: 'updated successfully',
      orderStatus: order.orderStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error while changing order status',
      Error: error,
    });
  }
};

const ordersController = {
  getOrders,
  getOrder,
  updateOrderStatus,
};

// export controller
export default ordersController;
