import { Order } from '../../models/index.js';

const chartServices = {
  fetchRevenueData: async ({ range = '7days', customRange = null }) => {
    try {
      const matchStage = {
        orderStatus: 'Delivered',
      };

      const now = new Date();
      let startDate, endDate;

      switch (range) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'yesterday':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case '7days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 6);
          endDate = new Date();
          break;
        case '14days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 13);
          endDate = new Date();
          break;
        case '30days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 29);
          endDate = new Date();
          break;
        case '90days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 89);
          endDate = new Date();
          break;
        case 'custom':
          if (customRange?.start && customRange?.end) {
            startDate = new Date(customRange.start);
            endDate = new Date(customRange.end);
          }
          break;
        default:
          // fallback to last 30 days
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 29);
          endDate = new Date();
      }

      if (startDate && endDate) {
        matchStage.orderDate = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const revenue = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
            totalRevenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      console.log(revenue);
      return revenue;
    } catch (error) {
      console.error('Error fetching filtered revenue:', error);
      throw error;
    }
  },
};

export default chartServices;
