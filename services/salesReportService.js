import Order from '../models/orderModel.js';

const SalesReportService = {
  getSalesData: async ({ range, startDate, endDate }) => {
    try {
      let salesData;

      // Fetch data based on range or custom date
      if (range) {
        const startDate = new Date();
        if (range === '1d') {
          startDate.setDate(startDate.getDate() - 1);
        } else if (range === '1w') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (range === '1m') {
          startDate.setMonth(startDate.getMonth() - 1);
        } else {
          throw new Error('Invalid range provided');
        }

        salesData = await Order.find({
          orderDate: { $gte: startDate },
          // orderStatus: 'Delivered',
        });
        console.log(salesData);
      } else if (startDate && endDate) {
        salesData = await Order.find({
          orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
      } else {
        throw new Error('Invalid filters provided');
      }

      // Process data to include discounts, coupons, and totals
      const totalSales = salesData.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );
      const totalDiscounts = salesData.reduce(
        (sum, sale) => sum + (sale.discountAmount || 0),
        0
      );
      const totalOrders = salesData.length;

      return {
        totalSales,
        totalDiscounts,
        totalOrders,
        salesDetails: salesData,
      };
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw new Error('Failed to fetch sales data');
    }
  },
};

export default SalesReportService;
