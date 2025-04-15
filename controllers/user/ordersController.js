// import libraries
import pdf from 'html-pdf';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';

//fix __dirname && __filename for module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import models
import Order from '../../models/orderModel.js';
import Product from '../../models/productModel.js';

import menus from '../../datasets/profileMenus.js';

// get all orders
const getAllOrders = async (req, res) => {
  let userMenus = [...menus];
  let user = req.session.user;

  if (!user) {
    return res.redirect('/auth/login');
  }

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
    // let orders = await Order.find({ userId: user._id })
    //   .sort({ orderDate: -1 })
    //   .skip(skip)
    //   .limit(limit);
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

// get single order details page
const getOrder = async (req, res) => {
  let id = req.params.orderId; // accessing id from query params
  try {
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
  } catch (error) {
    console.log({ Error: error });
    res.status(501).json({
      success: false,
      Error: error,
      message: 'Error while a showing order details',
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

// download invoice
const downloadInvoice = async (req, res) => {
  let user = req.session.user;
  let orderId = req.params.orderId;

  let order = await Order.findById(orderId);

  // console.log(order);
  // res.render('user/pages/order/invoice.ejs', { layout: false, order });

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
          if (err) {
            return res.status(500).send('Error generating PDF');
          }
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

// return order
const returnOrder = async (req, res) => {
  let { orderId, response } = req.body;

  try {
    let order = await Order.findById(orderId);

    order.orderStatus = 'Return Requested';
    order.returnReason = response;
    order.save();

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

// cancel order
const cancelOrder = async (req, res) => {
  const { orderId, response } = req.body;

  try {
    let order = await Order.findById(orderId);

    let items = order.orderedItems.forEach(async (item) => {
      let product = await Product.findOne(item.productId);
      product.quantity += item.quantity;
      product.save();
    });

    order.orderStatus = 'Cancelled';
    order.returnReason = response;
    order.save();

    res.status(200).json({
      success: true,
      message: 'order cancelled succesfully',
      redirect: `/account/orders/${orderId}`,
      data: req.body,
    });
  } catch (error) {
    console.log('error');
    res
      .status(500)
      .json({ success: false, message: 'cancel order processing failed' });
  }
};

const ordersController = {
  getAllOrders,
  getOrder,
  placeOrder,
  downloadInvoice,
  returnOrder,
  cancelOrder,
};

export default ordersController;
