import { Order, Product, Wallet } from '../../models/index.js';
import WalletTransaction from '../../models/walletTransactionModel.js';

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
  let totalItems = order?.orderedItems.reduce(
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

// return action for return approve or reject
const returnAction = async (req, res) => {
  let { orderId, action } = req.body;

  try {
    let user = req.user;
    let order = await Order.findById(orderId);
    let wallet = await Wallet.findOne({ userId: user._id });
    let transaction = await WalletTransaction.findOne({ userId: user._id });

    if (action === 'approve') {
      order.orderStatus = 'Returned';

      let items = order.orderedItems.forEach(async (item) => {
        let product = await Product.findOne(item.productId);
        product.quantity += item.quantity;
        product.save();

        // console.log(item.quantity, 'user qty');
        // console.log(product.quantity, 'product qty');
      });

      if (!wallet) {
        wallet = await Wallet.create({
          userId: user._id,
        });
      }

      // wallet amount increasing
      wallet.balance += order.totalAmount;

      // transaction saving
      transaction = await WalletTransaction.create({
        userId: user._id,
        type: 'credit',
        thumbnail: order.orderThumbnail,
        orderId: order._id,
        amount: order.totalAmount,
        description: order.productName,
      });

      await order.save();
      await wallet.save();
    } else if (action === 'reject') {
      order.orderStatus = 'Return Rejected';
      await order.save();
    }

    return res
      .status(200)
      .json({ success: true, message: `request ${action}` });
  } catch (error) {
    console.error({
      Error: error,
      message: 'Error while return request processing',
    });
    res.status(500).json({
      success: true,
      message: 'Error while return request processing',
    });
  }
};

const ordersController = {
  getOrders,
  getOrder,
  updateOrderStatus,
  returnAction,
};

// export controller
export default ordersController;
