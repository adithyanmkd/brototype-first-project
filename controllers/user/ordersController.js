// Import libraries
import pdf from 'html-pdf';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';

// Fix __dirname && __filename for module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Order from '../../models/orderModel.js';

// Import utils
import getUserMenus from '../../utils/getSidebarMenus.js';
import orderService from '../../services/user/orderService.js';

// Empty order page
const emptyOrderPage = (req, res) => {
  let user = req.session.user;

  let menus = getUserMenus(user); // Fetching user menus

  res.render('common/empty/emptyOrder.ejs', { menus });
};

// Get all orders
const getAllOrders = async (req, res) => {
  let user = req.session.user;
  let menus = getUserMenus(user); // Fetching user menus

  let search = req.query.search || '';
  let category = req.query.category || '';

  const page = parseInt(req.query.page) || 1;
  const limit = 6; // Number of users per page
  const skip = (page - 1) * limit;

  // Count total matching users
  const totalProducts = await Order.countDocuments({ userId: user._id });
  const totalPages = Math.ceil(totalProducts / limit);

  let matchQuery = {
    userId: new ObjectId(`${user._id}`),
    $or: [
      { orderId: { $regex: search, $options: 'i' } },
      { productName: { $regex: search, $options: 'i' } },
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
        $match: { ...matchQuery },
      },
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
        $sort: { orderDate: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    if (!orders.length > 0) {
      return res.redirect('/account/orders/empty-order');
    }

    res.render('user/pages/order/orders.ejs', {
      menus,
      orders,
      page,
      totalPages,
    });
  } catch (error) {
    console.log({ Error: error });
    res.status(501).json({
      success: false,
      Error: error,
      message: 'error while listing orders',
    });
  }
};

// Get single order details page
const getOrder = async (req, res) => {
  let id = req.params.orderId; // Accessing id from query params
  try {
    let order = await Order.findById(id).populate(
      'userId',
      'email name profilePic number'
    );

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Calculate total items
    let totalItems = order.orderedItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ); // Calculating total quantity

    const error = req.query.error || undefined; // Pass error query parameter for retry failures

    res.render('user/pages/order/orderDetails.ejs', {
      layout: 'layouts/user-layout.ejs',
      order,
      totalItems,
      error, // Pass error to the template
    });
  } catch (error) {
    console.log({ Error: error });
    res.status(501).json({
      success: false,
      Error: error,
      message: 'Error while showing order details',
    });
  }
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

// Download invoice
const downloadInvoice = async (req, res) => {
  let user = req.session.user;
  let orderId = req.params.orderId;

  let order = await Order.findById(orderId);

  ejs.renderFile(
    path.join(__dirname, '../../views/user/pages/order/invoice.ejs'),
    { order },
    (err, html) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error generating invoice');
      }

      pdf.create(html).toStream((err, stream) => {
        if (err) {
          return res.status(500).send('Error generating PDF');
        }

        res.setHeader(
          'Content-Disposition',
          'attachment; filename=invoice.pdf'
        );
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      });
    }
  );
};

// Return order
const returnOrder = async (req, res) => {
  let { orderId, response } = req.body;

  try {
    let order = await Order.findById(orderId);

    order.orderStatus = 'Return Requested';
    order.returnReason = response;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'return requested',
      redirect: `/account/orders/${orderId}`,
    });
  } catch (error) {
    console.log('error');
    res
      .status(500)
      .json({ success: false, message: 'return order processing failed' });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    let user = req.session.user;
    const { orderId, response } = req.body;
    let serviceResponse = await orderService.cancelOrder({
      userId: user._id,
      orderId,
      response,
    });

    if (!serviceResponse.success) {
      return res.status(500).json(serviceResponse);
    }

    return res.status(200).json(serviceResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while cancelling order.',
    });
  }
};

// Retry payment
const retryPayment = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { orderId } = req.params;
    // console.log('Order ID: ', orderId);

    const result = await orderService.retryPayment({ orderId, userId });
    if (!result.success) {
      return res.redirect(
        `/account/orders/${orderId}?error=${encodeURIComponent(result.message)}`
      );
    }

    res.render('user/pages/order/retryPayment.ejs', {
      order: result.order,
      razorpayOrderId: result.razorpayOrderId,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.redirect(
      `/account/orders/${req.params.orderId}?error=${encodeURIComponent('Error retrying payment')}`
    );
  }
};

const ordersController = {
  getAllOrders,
  getOrder,
  placeOrder,
  downloadInvoice,
  returnOrder,
  cancelOrder,
  emptyOrderPage,
  retryPayment, // Add the new retryPayment method
};

export default ordersController;
