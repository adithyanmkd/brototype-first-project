// third party libraries
import moment from 'moment';

import { User, Order } from '../../models/index.js';
import salesService from '../../services/admin/salesService.js';

//get dashboard
const getDashboard = async (req, res) => {
  try {
    let orders = await Order.find();
    let successfulOrders = await Order.find({ orderStatus: 'Delivered' });

    let totalUsers = await User.countDocuments(); // total users
    let totalSales = successfulOrders.reduce(
      (acc, val) => acc + val.totalAmount,
      0
    );

    // dashboard overview cards items
    const stats = [
      { title: 'Total Users', value: totalUsers },
      { title: 'Total Sales', value: `₹${totalSales}` },
      { title: 'Total Orders', value: orders.length },
    ];

    let productFetchResult = await salesService.getTop10Products();
    let categoryFetchResult = await salesService.getTop10Category();

    if (!productFetchResult.success) {
      return res.status(500).json(productFetchResult);
    }

    res.render('admin/pages/dashboard/dashboard', {
      layout: 'layouts/admin-layout.ejs',
      stats,
      top10Products: productFetchResult.top10Products,
      top10Category: categoryFetchResult.top10Category,
    });
  } catch (error) {
    console.error({ Error: error });
    res.status(500).json({
      success: false,
      message: 'Error from getDashboard controller',
      Error: error,
    });
  }
};

// get user chart data
const getUserChartData = async (req, res) => {
  const range = parseInt(req.query.range) || 7;

  try {
    const startDate = moment()
      .startOf('day')
      .subtract(range - 1, 'days')
      .toDate();

    const users = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%d %B', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Build complete range even if some days have 0 users
    const labels = [];
    const values = [];

    for (let i = 0; i < range; i++) {
      const date = moment()
        .subtract(range - 1 - i, 'days')
        .format('DD MMMM');
      labels.push(date);

      const record = users.find((u) => u._id === date);
      values.push(record ? record.count : 0);
    }

    // total users particular date range
    const totalUsers = values.reduce((acc, val) => acc + val);

    return res.status(200).json({ categories: labels, values, totalUsers });
  } catch (error) {
    res.status(500).json({
      success: false,
      Error: error,
      message: 'Error while fetching user data',
    });
  }
};

//export controllers
export default {
  getDashboard,
  getUserChartData,
};
