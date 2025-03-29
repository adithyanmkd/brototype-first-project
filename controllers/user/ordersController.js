// import libraries
import pdf from 'html-pdf';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

//fix __dirname && __filename for module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import menus from '../../datasets/profileMenus.js';
import Order from '../../models/orderModel.js';

// get all orders
const getAllOrders = async (req, res) => {
  let userMenus = [...menus];
  let user = req.session.user;

  try {
    let orders = await Order.find().sort({ orderDate: -1 });

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

// Sample invoice data
const invoiceData = {
  customerName: 'John Doe',
  date: new Date().toLocaleDateString(),
  items: [
    { name: 'Product 1', price: '$10' },
    { name: 'Product 2', price: '$20' },
  ],
  total: '$30',
};

// download invoice
const downloadInvoice = async (req, res) => {
  let user = req.session.user;
  let orderId = req.params.orderId;

  let order = await Order.findById(orderId);

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

const ordersController = {
  getAllOrders,
  getOrder,
  placeOrder,
  downloadInvoice,
};

export default ordersController;
