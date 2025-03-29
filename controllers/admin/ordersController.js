import { Order } from '../../models/index.js';

// get all orders list page
const getOrders = async (req, res) => {
  let search = req.query.search || '';
  let category = req.query.category || '';

  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of users per page
  const skip = (page - 1) * limit;

  // Count total matching users
  const totalProducts = await Order.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);

  let matchQuery = {
    $or: [
      { orderId: { $regex: search, $options: 'i' } },
      { 'user.name': { $regex: search, $options: 'i' } },
    ],
  };

  // Add category filter only if category is provided
  if (category) {
    if (category === 'All') {
      matchQuery.orderStatus = { $regex: '', $options: 'i' };
    } else {
      matchQuery.orderStatus = { $regex: category, $options: 'i' };
    }
  }

  try {
    let orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: matchQuery,
      },
      {
        $sort: { orderDate: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    if (req.xhr) {
      return res.status(200).json({ orders });
    }

    res.render('admin/pages/orders/orders.ejs', {
      layout: 'layouts/admin-layout.ejs',
      orders,
      page,
      totalPages,
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
